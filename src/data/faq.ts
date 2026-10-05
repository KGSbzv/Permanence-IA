// FAQ générale (doc 98) et FAQ tarifs (doc 104).
export interface QA { q: string; a: string }

export const FAQ_GENERAL: QA[] = [
  { q: 'Comment fonctionne la plateforme d’appels IA ?', a: 'Vous configurez un agent vocal avec vos informations, vos règles et votre ton. Il répond aux appels entrants, passe des appels sortants autorisés, qualifie les demandes, réserve des rendez-vous et vous transmet un résumé de chaque échange.' },
  { q: 'Puis-je utiliser mon système téléphonique existant ?', a: 'Oui. Vous pouvez renvoyer votre ligne actuelle vers l’agent, connecter votre standard ou votre opérateur par SIP, ou importer vos numéros Twilio et Telnyx.' },
  { q: 'Puis-je connecter mon calendrier ?', a: 'Oui : Google Agenda, Outlook, Cal.com et Calendly. L’agent propose les créneaux libres et réserve directement.' },
  { q: 'Est-ce que je peux modifier les prompts ?', a: 'Oui. L’éditeur de prompts vous permet de régler l’objectif, le ton, les questions et les limites de l’agent, guidé pas à pas, sans expertise technique.' },
  { q: 'Est-ce que je peux créer des scénarios sans code ?', a: 'Oui, avec le flow builder à partir de l’offre Croissance : vous enchaînez déclencheurs et actions en glissant-déposant, reliés à plus de 300 outils.' },
  { q: 'Puis-je utiliser WhatsApp et Instagram ?', a: 'Oui, à partir de l’offre Croissance : SMS, WhatsApp, Messenger et Instagram, avec historique centralisé.' },
  { q: 'Est-ce que vous fournissez des numéros ?', a: 'Oui, des numéros locaux dans plus de 150 pays. Vous pouvez aussi garder vos numéros existants.' },
  { q: 'Puis-je utiliser SIP ?', a: 'Oui, à partir de l’offre Croissance. Nous vous guidons pour connecter votre trunk SIP ou votre standard.' },
  { q: 'Comment chargez-vous les informations de mon entreprise ?', a: 'Vous ajoutez vos documents PDF, les pages de votre site ou vos procédures dans la base de connaissances. L’agent s’y réfère pendant l’appel.' },
  { q: 'Est-ce conforme au RGPD ?', a: 'La plateforme propose les outils nécessaires : consentement, liste d’exclusion, durée de rétention configurable, suppression des données et contrôle des accès. Votre configuration et vos mentions d’information restent à adapter à votre activité ; nous vous accompagnons.' },
  { q: 'Comment fonctionne l’essai gratuit ?', a: '14 jours d’essai gratuit avec 30 minutes d’appels incluses, sans engagement. À la fin, vous choisissez une offre ou vous arrêtez simplement.' },
  { q: 'L’agent se présente-t-il comme une IA ?', a: 'Oui. L’agent est présenté honnêtement comme un assistant IA, et peut transférer à un humain lorsque vous l’avez prévu.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'Que se passe-t-il après les 30 minutes d’essai ?', a: 'Les appels s’arrêtent jusqu’à ce que vous choisissiez une offre. Aucun paiement n’est déclenché automatiquement.' },
  { q: 'Les prix sont-ils HT ?', a: 'Oui, tous les prix sont affichés hors taxes. Les taxes locales s’ajoutent si elles s’appliquent.' },
  { q: 'Puis-je recharger des minutes ?', a: 'Oui, par recharges ponctuelles ou add-ons mensuels. Le dépassement est aussi facturé à la minute selon votre offre.' },
  { q: 'Puis-je utiliser mon propre numéro ?', a: 'Oui, par renvoi d’appel, import Twilio ou Telnyx, ou connexion SIP à partir de l’offre Croissance.' },
  { q: 'Avez-vous une démo live ?', a: 'Oui. Vous pouvez parler à l’agent depuis votre navigateur ou demander à être rappelé pour une démonstration.' },
  { q: 'Le tarif de lancement est-il garanti ?', a: 'Le tarif de lancement s’applique aux 20 premiers clients éligibles, tant que l’offre est ouverte. Le prix normal est indiqué sur chaque offre.' },
  { q: 'Puis-je changer d’offre ?', a: 'Oui, à tout moment. Le changement est visible avant confirmation et prend effet selon les conditions affichées.' },
];
