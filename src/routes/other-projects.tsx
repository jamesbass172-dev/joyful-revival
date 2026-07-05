import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { projects } from "@/content/site-content";

export const Route = createFileRoute("/other-projects")({
  head: () => ({
    meta: [
      { title: "Explore Our Projects — Joy for the Children" },
      { name: "description", content: "Explore JOYCO's programs: the BAG Program, Tungi Outreach, and Legal Assistance for children in Tanzania." },
      { property: "og:title", content: "Explore Our Projects — Joy for the Children" },
      { property: "og:description", content: "Explore JOYCO's programs: the BAG Program, Tungi Outreach, and Legal Assistance for children in Tanzania." },
    ],
  }),
  component: Other,
});

function Other() {
  return (
    <SiteLayout>
      <section className="container-narrow pt-16 pb-10 text-center">
        <span className="eyebrow">Programs &amp; Initiatives</span>
        <h1 className="mt-3 text-5xl md:text-6xl">Explore Our Projects</h1>
      </section>

      <section className="container-narrow pb-24 grid gap-8 md:grid-cols-3">
        {projects.map((p) => {
          const isInternal = p.cta.href.startsWith("/");
          return (
            <article key={p.title} className="bg-card rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] flex flex-col">
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl">{p.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed flex-1">{p.body}</p>
                <div className="mt-5">
                  {isInternal ? (
                    <Link to={p.cta.href} className="btn-primary inline-flex">{p.cta.label}</Link>
                  ) : (
                    <span className="btn-primary inline-flex opacity-70 cursor-default" aria-disabled>{p.cta.label}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </SiteLayout>
  );
}
