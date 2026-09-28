import type { Metadata } from "next";
import Deck from "./Deck";

export const metadata: Metadata = {
  title: "Dossier de présentation",
  description: "ViewZ, le premier réseau social dédié à la communauté danse : concept, fonctionnalités, la Scène ViewZ et contact.",
};

export default function PresentationPage() {
  return <Deck />;
}
