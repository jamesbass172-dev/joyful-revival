import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { heroImages, missionImage, objectives, stats } from "@/content/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joy for the Children — Ending violence against children in Tanzania" },
      { name: "description", content: "JOYCO is a Tanzanian NGO providing education, advocacy, psychological support, and legal assistance to vulnerable children." },
      { property: "og:title", content: "Joy for the Children" },
      { property: "og:description", content: "Ending violence against children in Tanzania through advocacy, education, and care." },
      { property: "og:image", content: heroImages[0] },
    ],
  }),
  component: Home,
});

function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-narrow pt-12 md:pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Tanzania · NGO</span>
            <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              A child's joy is our <span className="italic text-primary">responsibility</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              We strive to end violence of any kind against children through capacity building, advocacy, psychological support, and legal assistance — creating safe places where every child can thrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">Get Involved <ArrowRight className="h-4 w-4" /></a>
              <a href="#mission" className="btn-accent">Our Mission</a>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl text-primary">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-lift)]">
              {heroImages.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Children supported by Joy for the Children"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 flex-1 rounded-full transition ${idx === i ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-[var(--shadow-soft)] hidden md:flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent grid place-items-center"><Heart className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">Morogoro, Tanzania</div>
                <div className="text-xs text-muted-foreground">Based in Mvomero District</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-20 bg-secondary/50">
        <div className="container-narrow grid lg:grid-cols-2 gap-12 items-center">
          <img src={missionImage} alt="A child at our Montessori project" className="rounded-3xl shadow-[var(--shadow-soft)] aspect-[4/5] object-cover w-full" loading="lazy" />
          <div>
            <span className="eyebrow">The Heart of Our Purpose</span>
            <h2 className="mt-3 text-4xl md:text-5xl">Our Mission</h2>
            <p className="mt-5 text-lg text-foreground/80 leading-relaxed">
              We strive to end violence of any kind against children through dedicated capacity building, nationwide advocacy, comprehensive psychological support, and robust legal assistance. Our focus is on socio-economic empowerment and creating safe, nurturing environments where every child can thrive free from harm.
            </p>
            <blockquote className="mt-8 border-l-4 border-accent pl-5 italic font-display text-xl text-primary">
              "A child's joy is our responsibility."
            </blockquote>
            <h3 className="mt-10 text-2xl">Our Vision</h3>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              A future where every child in Tanzania lives free from violence, enjoying their rights, being protected, and having equal opportunities to realize their full potential.
            </p>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="py-20">
        <div className="container-narrow">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="eyebrow">What we do</span>
              <h2 className="mt-3 text-4xl md:text-5xl">Our Objectives</h2>
            </div>
            <p className="max-w-md text-muted-foreground">Five interlocking commitments that guide every program, partnership, and intervention we lead.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((o) => (
              <article key={o.title} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-[var(--shadow-lift)] transition">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={o.img} alt={o.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl">{o.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{o.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container-narrow relative">
          <Sparkles className="h-10 w-10 text-accent mb-4" />
          <h2 className="text-4xl md:text-5xl max-w-3xl">Our Commitment</h2>
          <p className="mt-6 text-lg text-primary-foreground/85 max-w-3xl leading-relaxed">
            At Joy for the Children, we are dedicated to creating a society where violence against children is eradicated. Our mission is to achieve this by employing a multi-faceted approach that includes capacity building, advocacy, psychological support, socio-economic empowerment, and legal assistance. We firmly believe that by addressing these aspects comprehensively, we can foster a safer and more nurturing environment for children throughout Tanzania, ensuring every child has the opportunity to reach their full potential.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="container-narrow grid lg:grid-cols-2 gap-12">
          <div>
            <span className="eyebrow">Get in Touch</span>
            <h2 className="mt-3 text-4xl md:text-5xl">We're here to support you.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Reach out to volunteer, provide assistance, or ask any questions. Every message helps us move closer to a Tanzania where every child can thrive.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div>
                <div className="font-semibold">Head Office</div>
                <div className="text-muted-foreground">CHANGARAWE Street, nearby MZUMBE ward, Mvomero District, Morogoro Region, P.O. BOX 6083.</div>
              </div>
              <div>
                <div className="font-semibold">General Inquiries</div>
                <a href="mailto:info@joyforthechildren.org" className="text-primary hover:underline">info@joyforthechildren.org</a>
              </div>
              <div>
                <div className="font-semibold">Administrative</div>
                <a href="mailto:abbasflugaenda@joyforthechildren.org" className="text-primary hover:underline break-all">abbasflugaenda@joyforthechildren.org</a>
              </div>
            </div>
          </div>

          <form
            action="mailto:info@joyforthechildren.org"
            method="post"
            encType="text/plain"
            className="bg-card rounded-3xl p-8 border border-border shadow-[var(--shadow-soft)] space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Full name *</label>
              <input required name="name" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium">Email address *</label>
              <input required type="email" name="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium">Message *</label>
              <textarea required name="message" rows={5} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" className="btn-primary w-full">Send message</button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
