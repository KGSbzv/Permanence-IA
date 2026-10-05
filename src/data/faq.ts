// FAQ générale (doc 98) et FAQ tarifs (doc 104).
export interface QA { q: string; a: string }

export const FAQ_GENERAL: QA[] = [
  { q: 'Comment fonctionne la plateforme d’appels IA ?', a: 'Vous configurez un agent vocal avec vos informations, vos règles et votre ton. Il répond aux appels entrants, passe des appels sortants autorisés, qualifie les demandes, réserve des rendez-vous et vous transmet un résumé de chaque échange.' },
  { q: 'Combien de temps faut-il pour démarrer ?', a: 'Un premier agent est prêt en quelques minutes à partir de vos informations. Pour une configuration complète (agenda, numéros, transferts), comptez en général un à deux jours, avec notre accompagnement.' },
  { q: 'Faut-il des compétences techniques ?', a: 'Non. Vous décrivez votre activité, l’assistant de prompts vous guide et nous vous aidons pour la téléphonie et les intégrations.' },
  { q: 'Que se passe-t-il si l’agent ne sait pas répondre ?', a: 'Il ne l’invente pas : il note la demande, propose un rappel ou transfère à votre équipe selon les règles que vous avez fixées.' },
  { q: 'L’agent peut-il gérer plusieurs appels en même temps ?', a: 'Oui. Plusieurs appels sont traités en parallèle sur la même ligne : vos clients n’attendent plus.' },
  { q: 'En quoi est-ce différent d’une messagerie ou d’un standard classique ?', a: 'Une messagerie enregistre, un standard oriente. L’agent IA comprend la demande, pose les questions utiles, agit (rendez-vous, rappel, réponse) et vous transmet une fiche exploitable.' },
  { q: 'Puis-je utiliser mon système téléphonique existant ?', a: 'Oui. Vous pouvez renvoyer votre ligne actuelle vers l’agent, connecter votre standard ou votre opérateur par SIP, ou importer vos numéros Twilio et Telnyx.' },
  { q: 'Puis-je connecter mon calendrier ?', a: 'Oui : Google Agenda, Outlook, Cal.com et Calendly. L’agent propose les créneaux libres et réserve directement.' },
  { q: 'Est-ce que je peux modifier les prompts ?', a: 'Oui. L’éditeur de prompts vous permet de régler l’objectif, le ton, les questions et les limites de l’agent, guidé pas à pas, sans expertise technique.' },
  { q: 'Est-ce que je peux créer des scénarios sans code ?', a: 'Oui, avec le flow builder à partir du forfait Assistant : vous enchaînez déclencheurs et actions en glissant-déposant, reliés à plus de 300 outils.' },
  { q: 'Puis-je utiliser WhatsApp et Instagram ?', a: 'Oui, à partir du forfait Assistant : SMS, WhatsApp, Messenger et Instagram, avec historique centralisé.' },
  { q: 'Est-ce que vous fournissez des numéros ?', a: 'Oui, des numéros locaux dans plus de 150 pays. Vous pouvez aussi garder vos numéros existants.' },
  { q: 'Puis-je utiliser SIP ?', a: 'Oui, à partir du forfait Assistant. Nous vous guidons pour connecter votre trunk SIP ou votre standard.' },
  { q: 'Comment chargez-vous les informations de mon entreprise ?', a: 'Vous ajoutez vos documents PDF, les pages de votre site ou vos procédures dans la base de connaissances. L’agent s’y réfère pendant l’appel.' },
  { q: 'Est-ce conforme au RGPD ?', a: 'La plateforme propose les outils nécessaires : consentement, liste d’exclusion, durée de rétention configurable, suppression des données et contrôle des accès. Votre configuration et vos mentions d’information restent à adapter à votre activité ; nous vous accompagnons.' },
  { q: 'Comment fonctionne l’essai gratuit ?', a: 'Vous créez votre compte, puis vous choisissez le forfait à tester : les 14 premiers jours sont gratuits, avec 30 minutes d’appels incluses. Une carte est demandée à l’activation mais rien n’est débité pendant l’essai. Annulez avant la fin des 14 jours et vous ne payez rien.' },
  { q: 'L’agent se présente-t-il comme une IA ?', a: 'Oui. L’agent est présenté honnêtement comme un assistant IA, et peut transférer à un humain lorsque vous l’avez prévu.' },
];

export const FAQ_PRICING: QA[] = [
  { q: 'Que se passe-t-il après les 30 minutes d’essai ?', a: 'Les 30 minutes sont le plafond de la période d’essai : une fois atteintes, les appels s’arrêtent jusqu’à la fin de l’essai ou jusqu’à ce que vous démarriez votre abonnement. À la fin des 14 jours, le forfait choisi démarre, sauf si vous l’avez annulé depuis votre espace.' },
  { q: 'Les prix sont-ils HT ?', a: 'Oui, tous les prix sont affichés hors taxes. Les taxes locales s’ajoutent si elles s’appliquent.' },
  { q: 'Que se passe-t-il si je dépasse mes minutes ?', a: 'Vous ajoutez des minutes à tout moment avec une recharge, pour dépanner un mois chargé. Si vous dépassez régulièrement, le forfait supérieur revient moins cher à la minute : nous vous le signalons.' },
  { q: 'Puis-je utiliser mon propre numéro ?', a: 'Oui, par renvoi d’appel, import Twilio ou Telnyx, ou connexion SIP à partir du forfait Assistant.' },
  { q: 'Avez-vous une démo live ?', a: 'Oui. Vous pouvez parler à l’agent depuis votre navigateur ou demander à être rappelé pour une démonstration.' },
  { q: 'Pourquoi une recharge coûte-t-elle plus cher à la minute qu’un forfait ?', a: 'La recharge sert de dépannage ponctuel. Le forfait reste la solution la plus économique pour un volume régulier : plus il est grand, plus le prix à la minute baisse.' },
  { q: 'Puis-je changer de forfait ?', a: 'Oui, à tout moment et sans engagement. Passez au forfait supérieur quand votre volume grandit ; le changement est affiché avant confirmation.' },
];
