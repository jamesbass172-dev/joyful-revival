import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { objectives } from "@/content/site-content";

export const Route = createFileRoute("/other-projects")({
  head: () => ({
    meta: [
      { title: "Other Projects — Joy for the Children" },
      { name: "description", content: "Beyond the Montessori project: advocacy, community response, well-being, and resource mobilization programs." },
      { property: "og:title", content: "Other Projects — Joy for the Children" },
    ],
  }),
  component: Other,
});

function Other() {
  return (
    <SiteLayout>
      <section className="container-narrow pt-16 pb-10">
        <span className="eyebrow">Programs &amp; Initiatives</span>
        <h1 className="mt-3 text-5xl md:text-6xl">Other Projects</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Alongside our Montessori classroom, JOYCO runs advocacy, community-response, and child-protection programs across the Morogoro Region.
        </p>
      </section>

      <section className="container-narrow pb-20 grid md:grid-cols-2 gap-6">
        {objectives.map((o) => (
          <article key={o.title} className="bg-card rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={o.img} alt={o.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl">{o.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{o.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-secondary py-16">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl">Partner with us.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">If your organization wants to support, fund, or co-deliver one of these programs, we'd love to hear from you.</p>
          <Link to="/" hash="contact" className="btn-primary mt-6 inline-flex">Contact us</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
