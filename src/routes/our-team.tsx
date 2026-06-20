import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { team } from "@/content/site-content";

export const Route = createFileRoute("/our-team")({
  head: () => ({
    meta: [
      { title: "Our Team — Joy for the Children" },
      { name: "description", content: "Meet the team behind Joy for the Children — leadership dedicated to protecting Tanzanian children." },
      { property: "og:title", content: "Our Team — Joy for the Children" },
      { property: "og:image", content: team[0]?.img },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <SiteLayout>
      <section className="container-narrow pt-16 pb-10">
        <span className="eyebrow">The People</span>
        <h1 className="mt-3 text-5xl md:text-6xl">Our Team</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A small, dedicated leadership team that powers the day-to-day work of Joy for the Children across Tanzania.
        </p>
      </section>
      <section className="container-narrow pb-20 space-y-10">
        {team.map((m, idx) => (
          <article key={m.name} className={`grid md:grid-cols-3 gap-8 items-center bg-card rounded-3xl p-6 md:p-10 border border-border shadow-[var(--shadow-soft)] ${idx % 2 ? "md:[&>img]:order-2" : ""}`}>
            <img src={m.img} alt={m.name} className="rounded-2xl aspect-[4/5] object-cover w-full" loading="lazy" />
            <div className="md:col-span-2">
              <div className="eyebrow">{m.role}</div>
              <h2 className="mt-2 text-3xl md:text-4xl">{m.name}</h2>
              <p className="mt-5 text-foreground/80 leading-relaxed">{m.bio}</p>
            </div>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
