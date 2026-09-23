import type { Metadata } from "next";
import { container, cx } from "@/lib/ui";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question, un partenariat, un souci avec l’app ? Écris à l’équipe ViewZ.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className={cx(container, "grid grid-cols-1 gap-12 pt-[140px] pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-20 lg:pt-[180px] lg:pb-32")}>
        <div>
          <h1 className="text-[clamp(38px,5.5vw,72px)] font-extrabold leading-[1.02] tracking-[-.03em] text-white">
            Contacte-nous.
          </h1>
          <p className="mt-6 max-w-[440px] text-base leading-relaxed text-muted">
            Une question, une idée de partenariat, un souci avec l’app ? Laisse-nous un message, on te répond par email.
          </p>

          <div className="mt-10 border-t border-line pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-brand-soft">Par email</p>
            <a href="mailto:gleam-pro@proton.me" className="mt-2 inline-block text-lg font-bold text-white no-underline hover:text-brand-light">
              gleam-pro@proton.me
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-line bg-white/4 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
