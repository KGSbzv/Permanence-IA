import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const { name, phone, email, company, sector, slot, note, consentCall, type, agent } = req.body;

    if (!consentCall) {
      return res.status(400).json({ error: 'Le consentement explicite au rappel est obligatoire.' });
    }

    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }

    // In production, this pushes to the AutoCalls White-label queue or internal CRM
    const trackingId = `CB-${Date.now().toString().slice(-6)}`;

    return res.status(200).json({
      success: true,
      message: 'Demande de rappel enregistrée avec succès dans le CRM.',
      callback: {
        trackingId,
        type: type || 'commercial',
        agent: agent || 'Agent Commercial IA',
        contactName: name,
        phone,
        email,
        company,
        sector: sector || 'plombiers',
        scheduledSlot: slot || 'asap',
        createdAt: new Date().toISOString(),
        status: 'queued',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erreur interne du serveur.' });
  }
}
