import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { heroImages, missionImage } from "@/content/site-content";
import { BookOpen, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/montessori-project")({
  head: () => ({
    meta: [
      { title: "Montessori Project — Joy for the Children" },
      { name: "description", content: "Our Montessori-based education initiative supports vulnerable children in Tanzania with quality early learning." },
      { property: "og:title", content: "Montessori Project — Joy for the Children" },
      { property: "og:image", content: missionImage },
    ],
  }),
  component: Montessori,
});

function Montessori() {
  return (
    <SiteLayout>
      <section className="container-narrow pt-16 pb-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Our flagship program</span>
          <h1 className="mt-3 text-5xl md:text-6xl">Montessori Project</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Quality early-childhood education for children from disadvantaged backgrounds in the Mvomero District. We combine Montessori pedagogy with safe, joyful environments where children build confidence and curiosity from their very first years.
          </p>
        </div>
        <img src={heroImages[1]} alt="Children at our Montessori classroom" className="rounded-3xl shadow-[var(--shadow-lift)] aspect-[4/3] object-cover w-full" />
      </section>

      <section className="container-narrow py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: "Quality Learning", body: "Hands-on Montessori materials and child-led discovery, delivered by trained early-childhood educators." },
          { icon: Users, title: "Family Support", body: "We work alongside 61 families, building bridges between school, home, and the broader community." },
          { icon: Sparkles, title: "Safe Spaces", body: "Every classroom is designed to be a protective space — free from violence, full of dignity and care." },
        ].map((f) => (
          <div key={f.title} className="bg-card rounded-2xl p-6 border border-border">
            <f.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 text-xl">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="container-narrow pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {heroImages.map((src) => (
          <img key={src} src={src} alt="Montessori project" className="rounded-2xl aspect-square object-cover w-full" loading="lazy" />
        ))}
      </section>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl">Support the next classroom.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Reach out to learn how to volunteer, sponsor a child, or partner with us.</p>
          <Link to="/" hash="contact" className="btn-accent mt-6 inline-flex">Get in touch</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
