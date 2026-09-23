import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 = défaut de Next ; 95 réservé aux grands visuels plein écran (hero),
    // dont les dégradés sombres se dégradent trop à 75.
    qualities: [75, 95],
  },
};

export default nextConfig;
