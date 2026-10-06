const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payments = await razorpay.payments.all({ count: 100 });
    const totalMoneyCollected = payments.items
      .filter(p => p.status === 'captured')
      .reduce((sum, p) => sum + (p.amount / 100), 0);

    const totalRegistrations = 15; 

    return res.status(200).json({
      success: true,
      registrations: totalRegistrations,
      totalRevenue: totalMoneyCollected,
      currency: 'INR'
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}
