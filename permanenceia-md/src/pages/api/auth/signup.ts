import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const { fullName, email, phone, company, sector, selectedPlan, coupon } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (nom, email).' });
    }

    // In a live environment with Supabase configured:
    // const { data, error } = await supabase.from('users').insert([...]);

    return res.status(200).json({
      success: true,
      message: 'Compte d’essai initialisé avec succès.',
      trial: {
        email,
        plan: selectedPlan || 'gratuit',
        expiresInDays: 7,
        mode: 'zero_numero_callback',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erreur interne du serveur.' });
  }
}
