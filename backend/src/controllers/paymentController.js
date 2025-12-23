import stripe, { stripeConfig } from '../config/stripe.js';
import { Order, Cart, CartItem, Product } from '../models/index.js';
import { getVATFromTotal } from '../utils/vatCalculator.js';
import { logAgeVerification } from '../middleware/ageVerification.js';

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { deliveryAddress, deliveryInstructions, deliveryDate, deliveryFee = 0 } = req.body;

    if (!req.user.ageVerified || !req.user.isLegalAge()) {
      return res.status(403).json({
        success: false,
        error: 'Age verification required to complete purchase',
      });
    }

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty',
      });
    }

    for (const item of cart.items) {
      if (!item.product.isInStock()) {
        return res.status(400).json({
          success: false,
          error: `${item.product.name} is out of stock`,
        });
      }

      if (item.product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Only ${item.product.stockQuantity} of ${item.product.name} available`,
        });
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    const totalAmount = subtotal + parseFloat(deliveryFee);
    const vatAmount = getVATFromTotal(totalAmount);

    const order = await Order.create({
      userId: req.user.id,
      subtotal: parseFloat(subtotal.toFixed(2)),
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      deliveryAddress,
      deliveryInstructions,
      deliveryDate,
      ageVerifiedAtCheckout: true,
      paymentStatus: 'pending',
      status: 'pending',
    });

    for (const item of cart.items) {
      await order.createItem({
        productId: item.productId,
        productName: item.product.name,
        productPrice: parseFloat(item.product.price),
        quantity: item.quantity,
        subtotal: parseFloat((item.product.price * item.quantity).toFixed(2)),
      });
    }

    await logAgeVerification(req.user.id, order.id, true, req);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: stripeConfig.currency.toLowerCase(),
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: req.user.id,
      },
      description: `Order ${order.orderNumber}`,
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      stripeConfig.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  const order = await Order.findOne({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: [
      {
        association: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (!order) {
    console.error('Order not found for payment intent:', paymentIntent.id);
    return;
  }

  order.paymentStatus = 'completed';
  order.paymentMethod = 'card';
  order.status = 'processing';
  await order.save();

  for (const item of order.items) {
    const product = item.product;
    product.stockQuantity -= item.quantity;
    await product.save();
  }

  const cart = await Cart.findOne({ where: { userId: order.userId } });
  if (cart) {
    await CartItem.destroy({ where: { cartId: cart.id } });
  }

  console.log(`Payment succeeded for order ${order.orderNumber}`);
};

const handlePaymentFailure = async (paymentIntent) => {
  const order = await Order.findOne({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
    console.log(`Payment failed for order ${order.orderNumber}`);
  }
};

const handlePaymentCanceled = async (paymentIntent) => {
  const order = await Order.findOne({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order) {
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();
    console.log(`Payment canceled for order ${order.orderNumber}`);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
};
