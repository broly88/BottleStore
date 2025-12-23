import pkg from 'nodemailer';
const nodemailer = pkg.default || pkg;
import dotenv from 'dotenv';

dotenv.config();

let transporter;
try {
  transporter = nodemailer?.createTransporter ? nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  }) : null;
} catch (error) {
  console.warn('Email service not configured. Email functionality will be disabled.');
  transporter = null;
}

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log(`Email would be sent to ${to}: ${subject} (Email service not configured)`);
    return { success: true, messageId: 'mock-message-id', note: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verify Email</a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">Please drink responsibly. You must be 18 or older to purchase alcohol.</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Verify Your Email Address',
    html,
    text: `Hi ${user.firstName}, please verify your email by visiting: ${verificationUrl}`,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html,
    text: `Hi ${user.firstName}, reset your password by visiting: ${resetUrl}`,
  });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order! Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> R${order.totalAmount}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      </div>
      <p>We'll send you another email when your order is ready for delivery.</p>
      <p>Thank you for shopping with us!</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">Please drink responsibly.</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
    text: `Order ${order.orderNumber} confirmed. Total: R${order.totalAmount}`,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
