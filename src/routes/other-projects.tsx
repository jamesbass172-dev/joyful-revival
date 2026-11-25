import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { projects } from "@/content/site-content";
import { Download, Phone, Mail, MapPin } from "lucide-react";
import bagDescription from "@/assets/bag-program-description.pdf.asset.json";
import { Button } from "@/components/ui/button";
import bagClassroom from "@/assets/bag-classroom-children.jpg.asset.json";
import bagPortrait from "@/assets/bag-student-portrait.jpg.asset.json";

export const Route = createFileRoute("/other-projects")({
  head: () => ({
    meta: [
      { title: "Explore Our Projects — Joy for the Children" },
      { name: "description", content: "Explore JOYCO's programs: the BAG Program, Tungi Outreach, and Legal Assistance for children in Tanzania." },
      { property: "og:title", content: "Explore Our Projects — Joy for the Children" },
      { property: "og:description", content: "Explore JOYCO's programs: the BAG Program, Tungi Outreach, and Legal Assistance for children in Tanzania." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Other,
});

const bagItems = [
  { name: "School bag", price: "20,000/=", need: "25 bags needed" },
  { name: "Exercise books", price: "3,000/=", need: "225 exercise books needed" },
  { name: "School shoes", price: "20,000/=", need: "25 pairs needed" },
  { name: "School uniform", price: "35,000/=", need: "25 pairs needed" },
  { name: "Sanitary pads", price: "2,000/=", need: "30 packs needed", note: "A pack of 10 pads" },
  { name: "Pen boxes", price: "5,000/=", need: "4 boxes needed", note: "Black and blue" },
  { name: "Mathematical set", price: "5,000/=", need: "25 sets needed" },
];

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
          const isAnchor = p.cta.href.startsWith("#");
          return (
            <article key={p.title} className="bg-card rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] flex flex-col">
              <div className="aspect-square overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="eager" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl">{p.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed flex-1">{p.body}</p>
                <div className="mt-5">
                  {isInternal ? (
                    <Link to={p.cta.href} className="btn-primary inline-flex">{p.cta.label}</Link>
                  ) : isAnchor ? (
                    <a href={p.cta.href} className="btn-primary inline-flex">{p.cta.label}</a>
                  ) : (
                    <span className="btn-primary inline-flex opacity-70 cursor-default" aria-disabled>{p.cta.label}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* BAG Program detail section */}
      <section id="bag-program" className="bg-secondary/40 border-t border-border scroll-mt-24">
        <div className="container-narrow py-20">
          <div className="text-center max-w-3xl mx-auto">
            <span className="eyebrow">Bridging Access for Girls</span>
            <h2 className="mt-3 text-4xl md:text-5xl">The BAG Program</h2>
            <p className="mt-2 text-lg font-medium text-primary">Help a girl stay in school in 2027</p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2 items-center">
            <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
              <img src={bagClassroom.url} alt="Schoolchildren in uniform in their classroom" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div>
              <h3 className="text-2xl">Education is free, but accessing it is not always free.</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                The Government of Tanzania has removed school fees in public primary and secondary schools through its Free Education Policy. Families are still expected to pay for other essentials such as school uniforms, shoes, exercise books, pens and mathematical instruments. For girls from economically disadvantaged families, these costs can become a serious barrier and may lead to irregular attendance, low self-esteem, limited classroom participation and in some cases school dropout.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Through the BAG Program, JOYCO is committed to making sure that financial hardship does not stop girls from pursuing their educational dreams. In 2026 the program supported <strong className="text-foreground">10 girls</strong> and in 2027 we aim to reach <strong className="text-foreground">25 girls</strong>. Your contribution, in cash or in kind, will help girls attend school regularly, learn with confidence and pursue their future aspirations.
              </p>
              <Button asChild variant="secondary" className="btn-accent mt-6 h-auto whitespace-normal text-center">
                <a href={bagDescription.url} download="The_BAG_Program_description.pdf">
                  <Download className="h-4 w-4" /> Download the BAG Programme description (PDF)
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-3xl text-center">Items Needed</h3>
            <p className="mt-2 text-center text-muted-foreground">You can bring the items yourself or donate money</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bagItems.map((item) => (
                <div key={item.name} className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
                  <p className="mt-2 text-primary font-semibold">@ {item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.need}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-3xl">Get in Touch</h3>
              <div className="mt-6 space-y-5">
                <div className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
                  <p className="font-semibold">Abbas Francis Lugaenda <span className="text-muted-foreground font-normal">— Director</span></p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /> +255 677 411 470 (Phone / WhatsApp)</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 shrink-0" /> abbasfmlugaenda@gmail.com</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
                  <p className="font-semibold">Rukia Daud <span className="text-muted-foreground font-normal">— Program Coordinator</span></p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /> +255 616 511 290 (Phone / WhatsApp)</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 shrink-0" /> +255 782 721 290 (Alternative)</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-soft)]">
                  <p className="font-semibold">Bring your donation to our center</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /> Joyful Montessori Education Center (JOYCO), Tungi Mwisho, Morogoro, Tanzania</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
              <img src={bagPortrait.url} alt="A young student in her school uniform" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
