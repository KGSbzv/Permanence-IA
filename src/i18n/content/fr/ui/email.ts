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
  // Copie d’un échange avec un assistant IA, envoyée à la personne qui l’a demandée (src/lib/conversationCopy.ts).
  // agent : prénom de la persona (null si l’agent n’est pas identifié) ; gender : genre de la persona, pour l’accord ;
  // day et time : date et heure de l’échange dans le fuseau du marché.
  copyMail: {
    subject: (agent: string | null, brand: string) => (agent ? `Copie de votre échange avec ${agent} · ${brand}` : `Copie de votre échange avec ${brand}`),
    intro: (agent: string | null, gender: 'female' | 'male', brand: string, day: string, time: string) =>
      `Voici la copie de votre échange avec ${agent ? `${agent}, ${gender === 'male' ? 'l’assistant' : 'l’assistante'} IA de ${brand},` : `l’assistant IA de ${brand},`} le ${day} à ${time}. Vous pouvez la conserver ou la copier comme vous le souhaitez.`,
    /** Étiquette des messages de la personne. */
    you: 'Vous',
    /** Étiquette des messages de l’agent quand son prénom n’est pas connu. */
    assistant: 'Assistant IA',
    /** Ajouté à un message anormalement long, raccourci. */
    cut: '(message raccourci)',
    truncated: (shown: number, total: number) => `Échange très long : cette copie ne reprend que les ${shown} premiers messages (sur ${total}).`,
    /** Remplace, dans un message de l’agent, un lien vers un autre site que permanenceia.com. */
    linkRemoved: '[lien retiré]',
    /** Après la transcription : l’adresse a pu être donnée par quelqu’un d’autre que son titulaire. */
    notYou: 'Vous recevez cet email parce que cette adresse a été donnée pendant l’échange. Si vous n’êtes pas à l’origine de cette demande, ignorez-le.',
  },
  // Code de connexion à la page Mon compte (src/lib/accountCode.ts), email essentiel.
  accountCode: {
    subject: (brand: string, code: string) => `Votre code de connexion ${brand} : ${code}`,
    hello: 'Bonjour,',
    line: (brand: string) => `Votre code pour accéder à votre compte sur le site ${brand} :`,
    valid: 'Il est valable 10 minutes et ne sert qu’une fois.',
    ignore: 'Si vous n’avez rien demandé, ignorez cet email : personne ne peut accéder à votre compte sans ce code.',
  },
  // Confirmation d’une demande d’assistance (ticket T-XXXXXXXX), email essentiel envoyé à la personne qui l’a faite
  // (src/lib/tickets.ts) : purement informatif, sans prix ni offre. when : date et heure du rappel en toutes lettres.
  ticketMail: {
    subject: (ticket: string, brand: string) => `Votre demande d’assistance ${ticket} est enregistrée · ${brand}`,
    hello: (first: string | null) => (first ? `Bonjour ${first},` : 'Bonjour,'),
    recorded: (ticket: string) => `Votre demande d’assistance est bien enregistrée sous le numéro ${ticket}. Gardez ce numéro : il permet de retrouver votre demande si vous nous recontactez.`,
    callAt: (when: string) => `Nous vous rappelons le ${when}.`,
    asap: 'Nous vous rappelons dès que possible, pendant nos horaires d’appel.',
    team: 'Une personne de l’équipe revient vers vous dès que possible.',
    reply: 'Pour ajouter une précision, répondez simplement à cet e-mail en rappelant votre numéro de ticket.',
    notYou: 'Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.',
    sign: (brand: string) => `L’équipe ${brand}`,
  },
};
