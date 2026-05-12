import nodemailer from 'nodemailer';

const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  // Create transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Calculate estimated delivery date (5-7 business days from now)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 5);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 7);

  const formatDate = (date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Build order items HTML
  const itemsHTML = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #1a1a1a;">
          <p style="margin: 0; font-family: 'Georgia', serif; font-size: 15px; color: #ffffff;">${item.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666666;">Qty: ${item.quantity}</p>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #1a1a1a; text-align: right;">
          <p style="margin: 0; font-family: monospace; font-size: 14px; color: #C5A059;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
        </td>
      </tr>`
    )
    .join('');

  const shippingAddr = order.shippingAddress;

  // Premium HTML Email Template
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 48px 24px 32px; border-bottom: 1px solid #1a1a1a;">
        <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 8px; color: #ffffff; font-weight: 400;">VELOURA</h1>
        <p style="margin: 8px 0 0; font-size: 10px; letter-spacing: 4px; color: #C5A059; text-transform: uppercase;">Premium Timepieces</p>
      </div>

      <!-- Greeting -->
      <div style="padding: 40px 32px 24px;">
        <p style="font-size: 14px; color: #888888; margin: 0 0 8px; letter-spacing: 2px; text-transform: uppercase;">Order Confirmed</p>
        <h2 style="font-family: 'Georgia', serif; font-size: 24px; color: #ffffff; margin: 0 0 24px; font-weight: 400;">Hello, ${userName}</h2>
        <p style="font-size: 14px; color: #999999; line-height: 1.8; margin: 0;">
          Thank you for choosing Veloura. Your order has been successfully placed and is now being prepared with the utmost care by our artisans. 
          We are honoured to have you as part of the Veloura family.
        </p>
      </div>

      <!-- Order Details Box -->
      <div style="margin: 16px 32px; padding: 28px; border: 1px solid #1a1a1a; background-color: #0d0d0d;">
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin: 0 0 16px;">Order Details</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 12px; color: #666666; letter-spacing: 1px; text-transform: uppercase;">Order ID</td>
            <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px; color: #ffffff;">${order._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 12px; color: #666666; letter-spacing: 1px; text-transform: uppercase;">Date</td>
            <td style="padding: 8px 0; text-align: right; font-size: 12px; color: #ffffff;">${formatDate(new Date(order.createdAt))}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 12px; color: #666666; letter-spacing: 1px; text-transform: uppercase;">Payment</td>
            <td style="padding: 8px 0; text-align: right; font-size: 12px; color: #4ade80;">Paid ✓</td>
          </tr>
        </table>
      </div>

      <!-- Items -->
      <div style="margin: 16px 32px; padding: 28px; border: 1px solid #1a1a1a; background-color: #0d0d0d;">
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin: 0 0 16px;">Items Ordered</p>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHTML}
        </table>
        
        <!-- Total -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #C5A059;">
          <table style="width: 100%;">
            <tr>
              <td style="font-size: 12px; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">Total</td>
              <td style="text-align: right; font-family: 'Georgia', serif; font-size: 20px; color: #C5A059;">₹${order.totalPrice.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="margin: 16px 32px; padding: 28px; border: 1px solid #1a1a1a; background-color: #0d0d0d;">
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin: 0 0 16px;">Shipping Address</p>
        <p style="font-size: 14px; color: #cccccc; line-height: 1.8; margin: 0;">
          ${shippingAddr.street}<br>
          ${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.zipCode}<br>
          ${shippingAddr.country}
        </p>
      </div>

      <!-- Delivery Estimate -->
      <div style="margin: 16px 32px; padding: 28px; border: 1px solid #1a1a1a; background-color: #0d0d0d; text-align: center;">
        <p style="font-size: 10px; letter-spacing: 3px; color: #C5A059; text-transform: uppercase; margin: 0 0 16px;">Estimated Delivery</p>
        <p style="font-family: 'Georgia', serif; font-size: 18px; color: #ffffff; margin: 0 0 8px;">
          ${formatDate(deliveryStart)} — ${formatDate(deliveryEnd)}
        </p>
        <p style="font-size: 12px; color: #666666; margin: 0;">
          Your timepiece will be shipped via secured armoured courier
        </p>
      </div>

      <!-- Footer -->
      <div style="padding: 40px 32px; text-align: center; border-top: 1px solid #1a1a1a; margin-top: 16px;">
        <p style="font-size: 12px; color: #666666; line-height: 1.8; margin: 0 0 16px;">
          If you have any questions about your order, please reply to this email or reach out to our concierge team.
        </p>
        <p style="font-family: 'Georgia', serif; font-size: 16px; letter-spacing: 6px; color: #333333; margin: 24px 0 8px;">VELOURA</p>
        <p style="font-size: 10px; color: #444444; letter-spacing: 2px; margin: 0;">CRAFTED WITH PRECISION. DELIVERED WITH CARE.</p>
      </div>
    </div>
  </body>
  </html>`;

  // Send the email
  const mailOptions = {
    from: `"Veloura Premium" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmed — Veloura #${order._id.toString().slice(-8).toUpperCase()}`,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Order confirmation sent to ${userEmail}`);
  } catch (error) {
    // Don't throw — email failure shouldn't block the order
    console.error('[Email] Failed to send confirmation:', error.message);
  }
};

export default sendOrderConfirmationEmail;
