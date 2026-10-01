import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  try {
    const { call_id, duration_seconds, transcript, sentiment, is_urgent, caller_number } = req.body;

    // Log call into database / Supabase
    // const { error } = await supabase.from('api_calls').insert([...]);

    return res.status(200).json({
      success: true,
      logged_call_id: call_id,
      status: 'processed',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erreur webhook Autocalls' });
  }
}
