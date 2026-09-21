// Liste canonique des styles de danse, alignée sur le seed Prisma
// (viewz-nest/prisma/seed.ts) — ce sont les seuls noms de Style existants en
// base, donc les seuls acceptés par l'API lors de la création d'un événement.
export const DANCE_STYLES = [
  "Hip-Hop", "Breakdance", "Popping", "Locking", "House", "Krump", "Waacking", "Twerk", "Flexing", "New Style",
  "Vogue", "Voguing", "Ballroom", "Afro", "Dancehall", "Reggaeton", "Afrobeats", "Mapouka", "Ndombolo",
  "Salsa", "Bachata", "Kizomba", "Merengue", "Cumbia", "Zouk", "Mambo", "Cha-cha",
  "Contemporain", "Classique", "Jazz", "Moderne", "Ballet", "Tap Dance", "Flamenco", "Tango", "Claquettes", "Acrobatie",
  "Kpop", "J-Pop", "Improvisation", "Fusion", "Sensuel", "Bollywood", "Street Jazz",
] as const;
