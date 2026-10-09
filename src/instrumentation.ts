// Démarrage du serveur Next.js (une fois par instance) : journal structuré pour Google Cloud Logging, avec la gravité de
// chaque entrée (src/lib/log.ts ; audit des parcours du 9 oct. 2026, action 16). Seulement dans l’environnement Node.js
// (jamais dans le middleware « edge ») et seulement sur Cloud Run ou avec LOG_FORMAT=json : en local, rien ne change.
// Activé par experimental.instrumentationHook dans next.config.js (Next.js 14).
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { setupServerLogging } = await import('./lib/log');
  setupServerLogging();
}
