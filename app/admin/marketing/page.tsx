import type { Metadata } from "next";
import MarketingDeck from "./MarketingDeck";

export const metadata: Metadata = { title: "Plan marketing" };

export default function MarketingPage() {
  return <MarketingDeck />;
}
