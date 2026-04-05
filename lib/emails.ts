import { Resend } from 'resend';

// Added shippingAddress to the interface
interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: any[];
  shippingAddress?: any; 
}

export async function sendOrderConfirmations(order: OrderDetails) {
  if (!process.env.RESEND_API_KEY) {
    console.error("CRITICAL: Resend API key is missing. Emails aborted.");
    return { success: false, error: "Missing API Key" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Hardcoding your email here as a fallback just in case the .env variable is missing
  const adminEmail = 'palashkhurana65@gmail.com';

  try {
    // 1. Send Email to the Customer (Unchanged)
    const customerEmailPromise = resend.emails.send({
      from: 'Ferixo Store <orders@ferixo.in>', 
      to: order.customerEmail,
      subject: `Order Confirmation - Ferixo #${order.orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0A1A2F;">Thank you for your order, ${order.customerName}!</h2>
          <p>We've received your order and are getting it ready to be shipped. Your order ID is <strong>#${order.orderId.slice(0, 8).toUpperCase()}</strong>.</p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul style="padding-left: 20px;">
              ${order.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}
            </ul>
            <p style="font-size: 18px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px;">
              Total Paid: ₹${order.totalAmount.toLocaleString()}
            </p>
          </div>
          
          <p>We will notify you again once your package has shipped.</p>
          <p>Best regards,<br/>The Ferixo Team</p>
        </div>
      `,
    });

    // 2. Send Email to You (The Admin) - NOW WITH SHIPPING DETAILS
    const adminEmailPromise = resend.emails.send({
      from: 'Ferixo System <alerts@ferixo.in>',
      to: adminEmail,
      subject: `🚨 New Order Received: ₹${order.totalAmount} from ${order.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2563eb;">New Order Alert</h2>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Customer Name:</strong> ${order.customerName}</p>
          <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
          <p><strong>Total Value:</strong> ₹${order.totalAmount.toLocaleString()}</p>
          
          ${order.shippingAddress ? `
          <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #0A1A2F;">Shipping Details:</h3>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${order.shippingAddress.street}</p>
            <p style="margin: 5px 0;"><strong>City/State:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
          </div>
          ` : '<p style="color: red;"><em>Shipping details not found in order snapshot.</em></p>'}

          <hr />
          <h3>Items Ordered:</h3>
          <ul>
            ${order.items.map(item => `<li>${item.quantity}x ${item.name} (${item.variant || 'Default'})</li>`).join('')}
          </ul>
          <a href="https://ferixo.in/admin/orders/${order.orderId}" style="display: inline-block; padding: 10px 20px; background-color: #0A1A2F; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">View in Admin Dashboard</a>
        </div>
      `,
    });

    await Promise.all([customerEmailPromise, adminEmailPromise]);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to send emails:", error);
    return { success: false, error };
  }
}