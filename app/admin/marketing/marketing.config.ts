// Contenu du plan marketing (/admin/marketing).
// Pour ajouter une action : copier un bloc { title, ... } dans la liste `actions` d'un horizon.
// Pour en retirer une : supprimer son bloc. Idem pour ajouter / retirer un horizon entier.
// Chaque horizon ouvre un chapitre, chaque action devient une slide :
// numéros, compteurs et barre de progression se recalculent tout seuls.

export type MarketingPoint = {
  title: string;
  description?: string;
  tags?: string[]; // petites pastilles (réseaux, styles, médias...)
};

// Une action peut regrouper des parties (`points`) : elles restent sur la même
// slide et apparaissent une par une à chaque « suivant ».
export type MarketingAction = MarketingPoint & { points?: MarketingPoint[] };

export type MarketingHorizon = {
  label: string;
  period?: string; // ex. « 0 – 6 mois »
  summary?: string;
  actions: MarketingAction[];
};

export const MARKETING: {
  eyebrow: string; // petit libellé en haut du diaporama
  title: string; // titre de la couverture
  intro?: string; // texte sous le titre de la couverture (facultatif)
  horizons: MarketingHorizon[];
} = {
  eyebrow: "Plan marketing",
  title: "Plan Marketing - v1",

  horizons: [
    {
      label: "Court terme",
      period: "Maintenant",
      summary: "Occuper les réseaux, créer du contenu et faire entrer les premiers danseurs dans l’app.",
      actions: [
        {
          title: "Réseaux sociaux",
          tags: ["Instagram", "TikTok", "Pinterest", "Meta Ads"],
          points: [
            {
              title: "Contenu organique",
              tags: ["Affiches & visuels", "Reels / TikToks", "Micro-trottoir"],
            },
            {
              title: "Vidéos pub scénarisées",
              description: "Vidéos travaillées et scénarisées postées sur les réseaux.",
            },
            {
              title: "Appel à danseurs",
              tags: ["Scène ViewZ", "Pub", "Shooting"],
              description:
                "Contacter des danseurs sur les réseaux pour des projets. Condition pour candidater : installer l’app, poster une vidéo vitrine et répondre à l’annonce depuis ViewZ.",
            },
            {
              title: "Challenges en ligne",
              description:
                "Challenges thématiques sur l’app, exemple : poster une vidéo avec son move signature. Crée de l’engagement et du contenu utilisateur.",
            },
          ],
        },
        {
          title: "Partenariats événements",
          tags: ["Battles", "Showcases", "Événements danse"],
          description: "Stand ou prise de parole lors d’événements danse.",
        },
        {
          title: "Collab beatmakers",
          description: "Connecter beatmakers et danseurs autour de projets communs.",
        },
      ],
    },
    {
      label: "Moyen terme",
      period: "Prochaine étape",
      summary: "Financer la suite avec la communauté et s’ancrer dans les lieux de la danse.",
      actions: [
        {
          title: "Ulule",
          description: "Campagne de crowdfunding pour financer les prochaines features avec la communauté.",
        },
        {
          title: "Studios de danse partenaires",
          description:
            "Référencement du studio sur la carte ViewZ, cours et événements visibles par toute la communauté danse à proximité. En échange, affichage dans le studio, mention aux élèves etc.",
        },
        {
          title: "Ambassadeurs par style",
          tags: ["Hip-hop", "Afro", "Krump", "Contemporain", "K-pop"],
          description:
            "Un danseur référent par discipline qui parle de ViewZ à sa communauté. En échange, badge ambassadeur exclusif sur son profil ViewZ et mise en avant sur nos réseaux.",
        },
        {
          title: "Presse spécialisée",
          tags: ["Mouvement", "Snobissimo", "Hip Hop Corner"],
          description: "Contacter des médias culture urbaine.",
        },
      ],
    },
    {
      label: "Long terme",
      period: "La vision",
      summary: "ViewZ devient une identité au-delà de l’app.",
      actions: [
        {
          title: "Marque ViewZ",
          tags: ["T-shirt", "Hoodie"],
          description:
            "Merchandising porté par les danseurs ambassadeurs. ViewZ devient une identité au-delà de l’app.",
        },
      ],
    },
  ],
};
