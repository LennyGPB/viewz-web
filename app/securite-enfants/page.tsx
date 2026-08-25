import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de sécurité des enfants",
  description: "Engagements de ViewZ pour la sécurité et la protection des mineurs.",
};

const contact = <a href="mailto:gleam-pro@proton.me">gleam-pro@proton.me</a>;

const sections: LegalSection[] = [
  {
    id: "engagement",
    number: "01",
    title: "Notre engagement",
    content: <p>ViewZ est une application communautaire dédiée aux danseurs. Nous appliquons une politique de tolérance zéro envers tout contenu représentant ou facilitant l’exploitation sexuelle ou les abus sur mineurs (CSAM).</p>,
  },
  {
    id: "contenus-interdits",
    number: "02",
    title: "Contenus interdits",
    content: <><p>Il est strictement interdit de publier, partager ou distribuer via ViewZ :</p><ul><li>tout contenu sexuellement explicite impliquant des mineurs ;</li><li>tout contenu suggérant, facilitant ou promouvant l’exploitation sexuelle de mineurs ;</li><li>tout contenu visant à établir un contact inapproprié avec des mineurs.</li></ul><p>Tout contenu de ce type sera immédiatement supprimé et signalé aux autorités compétentes.</p></>,
  },
  {
    id: "signalement",
    number: "03",
    title: "Signalement",
    content: <><p>Tout utilisateur peut signaler un contenu inapproprié directement depuis l’application via le bouton « Signaler », ou par email à {contact}.</p><p>Nous nous engageons à traiter chaque signalement dans les plus brefs délais.</p></>,
  },
  {
    id: "autorites",
    number: "04",
    title: "Signalement aux autorités",
    content: <><p>Conformément aux lois françaises et européennes en vigueur, tout contenu d’abus sexuel sur mineur détecté sur ViewZ sera signalé :</p><ul><li>à la <a href="https://www.internet-signalement.gouv.fr/" target="_blank" rel="noreferrer">plateforme PHAROS</a>, plateforme nationale de signalement des contenus illicites ;</li><li>aux autorités judiciaires compétentes ;</li><li>au <a href="https://report.cybertip.org/" target="_blank" rel="noreferrer">NCMEC via CyberTipline</a>, si applicable.</li></ul></>,
  },
  {
    id: "contact",
    number: "05",
    title: "Contact",
    content: <><div className="contact-box"><p>Pour toute question relative à la sécurité des enfants sur ViewZ :<br />{contact}</p></div><p>ViewZ respecte l’ensemble des lois applicables en matière de protection des mineurs, notamment la loi française, le RGPD et les directives européennes sur les services numériques (DSA).</p></>,
  },
];

export default function ChildSafetyPage() {
  return <LegalLayout title="Politique de sécurité des enfants" kicker="PROTECTION DES MINEURS" sections={sections} />;
}
