import type { Metadata } from "next";
import { ambientGlow, btnGradient, cx, eyebrow, shellBackground } from "@/lib/ui";

export const metadata: Metadata = { title: "Suppression de compte" };

export default function AccountDeletionPage() {
  return (
    <main className={cx("relative min-h-screen overflow-hidden", shellBackground)}>
      <div className={ambientGlow} />
      <div className="relative mx-auto w-[calc(100%_-_32px)] pt-[52px] pb-[120px] xs:w-[min(680px,calc(100%_-_40px))] md:pt-[90px]">
        <section>
          <p className={eyebrow}>GESTION DU COMPTE</p>
          <h1 className="mt-[18px] mb-6 text-[clamp(38px,5vw,58px)] leading-[1.02] tracking-[-.05em]">Demander la suppression de ton compte</h1>
          <p className="text-base leading-[1.75] text-muted">
            Pour supprimer ton compte ViewZ, envoie simplement un email depuis l’adresse associée à ton compte. Indique ton nom d’utilisateur afin que nous puissions identifier et traiter ta demande.
          </p>
          <a
            className={cx(btnGradient, "mt-[22px] inline-block rounded-full px-6 py-[15px] text-sm no-underline shadow-[0_12px_30px_rgba(124,58,237,.25)] hover:-translate-y-0.5")}
            href="mailto:gleam-pro@proton.me?subject=Demande%20de%20suppression%20de%20compte%20ViewZ"
          >
            Écrire à gleam-pro@proton.me
          </a>
          <div className="mt-[34px] border-l-2 border-purple bg-purple/6 p-5">
            <strong className="text-sm">Ce qui sera supprimé</strong>
            <p className="mt-2 text-[13px] leading-[1.65] text-dim">
              Ton profil, tes médias et les données associées à ton compte. Certaines données peuvent être conservées temporairement lorsque la loi l’exige.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
