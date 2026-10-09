// Masquage des adresses e-mail dans un texte d’erreur (réponse SMTP « 550 5.1.1 <client@…> », message d’une API…)
// avant de l’enregistrer ou de le journaliser : le journal des erreurs ne contient jamais l’identité d’un client.
// Module sans dépendance, partagé par la copie des conversations (src/lib/conversationCopy.ts) et le moteur des
// relances (src/lib/relances/engine.ts).

/**
 * Adresses email masquées avant d’enregistrer ou de journaliser une erreur d’envoi (réponse SMTP…). Une adresse
 * n’est cherchée qu’au début d’un mot (jamais depuis son milieu) : temps linéaire, même sur un long texte sans « @ ».
 */
export const maskEmails = (s: string) => s.replace(/(?<![^\s<>@])[^\s<>@]+@[^\s<>@]+/g, '[adresse]');
