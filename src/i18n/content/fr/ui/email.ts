// Textes des emails envoyés par le site : pied de page commun (mentions, préférences, désinscription),
// page « Préférences email » (/preferences-email) et email du lien personnel de gestion des préférences.
// Pied : {year}, {company}, {brand} et {email} sont remplacés à l’envoi (src/lib/emailFooter.ts) ; chaque
// phrase à lien est découpée en [avant, texte du lien, après] ; manageNoEmail sert quand l’adresse n’est pas connue.
type LinkSentence = [string, string, string];

export const UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}, tous droits réservés.',
    brandOf: '{brand} est une marque de {company}.',
    question: 'Vous souhaitez changer la façon dont vous recevez ces emails ?',
    manage: ['Vous pouvez gérer vos préférences email pour {email} ', 'ici', ''] as LinkSentence,
    manageNoEmail: ['Vous pouvez gérer vos préférences email ', 'ici', ''] as LinkSentence,
    unsubscribe: ['ou vous désinscrire de tous les emails ', 'ici', '.'] as LinkSentence,
    terms: 'Conditions générales',
    privacy: 'Politique de confidentialité',
  },
  prefs: {
    meta: {
      title: (brand: string) => `Préférences email · ${brand}`,
      description: 'Choisissez les emails que vous recevez de notre part, ou désinscrivez-vous des emails non essentiels.',
    },
    h1: 'Vos préférences email',
    intro: (brand: string) => `Choisissez les emails que vous recevez de ${brand}.`,
    address: 'Adresse email',
    current: 'Choix actuel',
    essential: { title: 'Seulement les emails essentiels du compte', text: 'Plus aucun email non essentiel : ni actualités, ni conseils, ni offres.' },
    all: { title: 'Tous les emails', text: 'Les emails essentiels, ainsi que nos actualités, conseils et offres.' },
    save: 'Enregistrer mon choix',
    saving: 'Enregistrement…',
    unsubscribeTitle: 'Confirmer la désinscription',
    unsubscribeText: 'Un clic suffit : vous ne recevrez plus que les emails essentiels du compte.',
    unsubscribeButton: 'Me désinscrire des emails non essentiels',
    saved: {
      essential_only: 'C’est noté : vous ne recevrez plus que les emails essentiels du compte.',
      all: 'C’est noté : vous recevrez tous nos emails.',
    },
    always: 'Quel que soit votre choix, nous envoyons toujours les emails indispensables : codes de sécurité, reçus et factures, et réponses à vos propres demandes.',
    error: (email: string) => `Votre choix n’a pas pu être enregistré. Réessayez dans quelques minutes ou écrivez-nous à ${email}.`,
    invalid: 'Ce lien n’est pas valide ou n’a été copié qu’en partie. Demandez un nouveau lien ci-dessous.',
    askTitle: 'Recevoir un lien pour gérer vos préférences',
    askText: 'Pour protéger votre adresse, indiquez-la ci-dessous : nous vous envoyons par email un lien personnel pour choisir les emails que vous recevez. Personne d’autre ne peut modifier vos préférences.',
    emailLabel: 'Votre adresse email',
    send: 'Recevoir le lien',
    sending: 'Envoi…',
    sent: 'Si cette adresse est valide, un email avec votre lien personnel vient d’y être envoyé (pensez à regarder dans les spams).',
    tooMany: 'Trop de demandes : réessayez plus tard.',
  },
  linkMail: {
    subject: (brand: string) => `Vos préférences email ${brand}`,
    hello: 'Bonjour,',
    line: (brand: string) => `Voici votre lien personnel pour choisir les emails que vous recevez de ${brand} :`,
    button: 'Gérer mes préférences',
    ignore: 'Si vous n’avez rien demandé, ignorez cet email : rien ne changera.',
  },
};
