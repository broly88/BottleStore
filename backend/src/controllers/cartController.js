import { Cart, CartItem, Product } from '../models/index.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.items = [];
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        cart,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    if (!product.isInStock()) {
      return res.status(400).json({
        success: false,
        error: 'Product is out of stock',
      });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.stockQuantity} items available`,
      });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stockQuantity} items available`,
        });
      }

      existingItem.quantity = newQuantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        cart,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(id, {
      include: [
        {
          model: Cart,
          as: 'cart',
        },
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      });
    }

    if (cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${cartItem.product.stockQuantity} items available`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

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

    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        cart,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByPk(id, {
      include: [{ model: Cart, as: 'cart' }],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await cartItem.destroy();

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

    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        cart,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        cart: {
          ...cart.toJSON(),
          items: [],
        },
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
