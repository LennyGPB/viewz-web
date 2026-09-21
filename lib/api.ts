// URL du backend NestJS. Les appels passent uniquement par des Route Handlers
// côté serveur (jamais depuis le navigateur) afin de ne jamais exposer le
// token d'authentification au client et d'éviter tout souci de CORS.
export const NEST_API_URL = (
  process.env.NEST_API_URL ?? "https://viewz-nest-production.up.railway.app"
).replace(/\/$/, "");
