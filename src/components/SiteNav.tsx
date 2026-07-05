import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { logoUrl } from "@/content/site-content";

const links = [
  { to: "/", label: "Home" },
  { to: "/montessori-project", label: "Montessori Project" },
  { to: "/our-team", label: "Our Team" },
  { to: "/other-projects", label: "Other Projects" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container-narrow flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoUrl} alt="JOYCO logo" className="h-10 w-10 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight">Joy for the Children</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition"
              activeProps={{ className: "px-4 py-2 rounded-full text-sm font-semibold text-primary bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/" hash="contact" className="btn-accent ml-2 !py-2 !px-4 text-sm">Get Involved</Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-narrow py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-md hover:bg-secondary">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
