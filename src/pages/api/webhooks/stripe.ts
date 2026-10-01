import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    // Process Stripe webhook payload
    const event = req.body;

    switch (event.type) {
      case 'checkout.session.completed':
        // Handle checkout completion & provision account
        break;
      case 'customer.subscription.updated':
        // Update subscription status in database
        break;
      case 'customer.subscription.deleted':
        // Handle cancellation
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Erreur Webhook: ${err.message}`);
  }
}
