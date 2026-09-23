// Partagé entre le formulaire (client) et la route /api/contact (serveur).
export const CONTACT_SUBJECTS = [
  "Question générale",
  "Partenariat / organisateur",
  "Problème technique",
  "Presse",
  "Autre",
] as const;

export const CONTACT_LIMITS = { name: 80, email: 120, message: 2000, minMessage: 10 } as const;
