import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Decoder } from "@/components/decoder";
import { SITUATION_LABEL } from "@/lib/alerts";
import { EXAMPLE_SHARED, PUBLIC_URL, isIndexable, ogPath, parseShared, resultPath, sharedResult } from "@/lib/share";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const shared = parseShared(await searchParams);
  if (!shared) return { title: "Alert", robots: { index: false, follow: true } };
  const p = sharedResult(shared).primary!;
  const title = `${p.nameJa} = ${p.nameEn}: what it means and what to do`;
  const description = `${p.meaning.slice(0, 220)} What to do: ${p.doNow[0]} Official sources, as of ${sharedResult(shared).dataAsOf}. Not an alert service.`;
  const url = `${PUBLIC_URL}${resultPath(shared)}`;
  return {
    title,
    description,
    alternates: { canonical: isIndexable(shared) ? url : `${PUBLIC_URL}${resultPath({ alert: shared.alert, situation: null, lang: null })}` },
    robots: isIndexable(shared) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: `Japan Alert Decoder · ${p.nameEn}`, description, type: "website", url, images: [{ url: ogPath(shared), width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title: `Japan Alert Decoder · ${p.nameEn}`, description, images: [ogPath(shared)] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const shared = parseShared(await searchParams);
  if (!shared) redirect("/");
  const r = sharedResult(shared);
  const p = r.primary!;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Japan alert decoder · {p.nameJa}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          {p.nameEn}
          {p.level && p.levelKind === "alert-level" ? <span className="text-muted"> · Level {p.level}</span> : null}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {p.urgencyLabel}
          {shared.situation ? ` · ${SITUATION_LABEL[shared.situation]}` : ""} · official rules as of {r.dataAsOf}
        </p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-muted underline underline-offset-2 hover:text-foreground">
            ← Decode another alert
          </Link>
          {resultPath(shared) === resultPath(EXAMPLE_SHARED) ? null : (
            <>
              {" · "}
              <Link href={resultPath(EXAMPLE_SHARED)} className="text-muted underline underline-offset-2 hover:text-foreground">
                Earthquake Early Warning on a train
              </Link>
            </>
          )}
        </p>
      </section>
      <section className="mt-8">
        <Decoder initial={shared} />
      </section>
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {HONESTY}
      </p>
    </div>
  );
}
