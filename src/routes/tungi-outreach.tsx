import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

const gallery = [
  "https://static.wixstatic.com/media/eee064_811d77896b724058b01f46553aee4fdd~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_811d77896b724058b01f46553aee4fdd~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_fe6c7b7795aa4e69bb4b73ddfeedae30~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_fe6c7b7795aa4e69bb4b73ddfeedae30~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_5c4fd442d0224b1eb2607aba52d18bad~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_5c4fd442d0224b1eb2607aba52d18bad~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_424555c537ea44628419853d84d0b777~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_424555c537ea44628419853d84d0b777~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_db67e13725404d3fb20c1ebe57ecbe9c~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_db67e13725404d3fb20c1ebe57ecbe9c~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_35bdcc8c3b89495c9d4aeb5ec4ec0ab1~mv2.jpg/v1/fill/w_1200,h_1600,al_c,q_90,enc_auto/eee064_35bdcc8c3b89495c9d4aeb5ec4ec0ab1~mv2.jpg",
  "https://static.wixstatic.com/media/eee064_075e05e6f5084727a58b82b3f044c8c8~mv2.jpg/v1/fill/w_1600,h_1067,al_c,q_90,enc_auto/eee064_075e05e6f5084727a58b82b3f044c8c8~mv2.jpg",
];

export const Route = createFileRoute("/tungi-outreach")({
  head: () => ({
    meta: [
      { title: "Tungi Outreach Program — Joy for the Children" },
      { name: "description", content: "Providing food, clothes, and support to underprivileged children and their families in the Tungi community." },
      { property: "og:title", content: "Tungi Outreach Program — Joy for the Children" },
      { property: "og:description", content: "Providing food, clothes, and support to underprivileged children and their families in the Tungi community." },
      { property: "og:image", content: gallery[0] },
    ],
  }),
  component: TungiPage,
});

function TungiPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <SiteLayout>
      <section className="container-narrow pt-16 pb-8">
        <span className="eyebrow">Program</span>
        <h1 className="mt-3 text-5xl md:text-6xl">Tungi Outreach Program</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Providing food, clothes, and support to underprivileged children and their families in the Tungi community.
        </p>
      </section>

      <section className="container-narrow pb-20">
        <div className="grid gap-4 md:grid-cols-3 auto-rows-[260px] md:auto-rows-[320px]">
          {gallery.map((src, i) => {
            const wide = i === 6;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setLightbox(i)}
                className={`group relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)] ${wide ? "md:col-span-3 md:row-span-1" : ""}`}
              >
                <img
                  src={src}
                  alt={`Tungi Outreach photo ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-full">
                  {String(i + 1).padStart(2, "0")} / 07
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl">Want to support the next outreach?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every contribution helps us bring food, clothing, and hope to more families in Tungi.
          </p>
          <Link to="/other-projects" className="btn-primary mt-6 inline-flex">Back to Projects</Link>
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <button
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-3"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}
          >
            ‹
          </button>
          <img
            src={gallery[lightbox]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-3"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}
          >
            ›
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {String(lightbox + 1).padStart(2, "0")} / 07
          </span>
        </div>
      )}
    </SiteLayout>
  );
}
