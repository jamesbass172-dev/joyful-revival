import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { logoUrl } from "@/content/site-content";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-narrow py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src={logoUrl} alt="JOYCO logo" className="h-11 w-11 object-contain bg-white/10 rounded-full p-1" />
            <span className="font-display text-xl">Joy for the Children</span>
          </div>
          <p className="text-primary-foreground/80 max-w-md leading-relaxed">
            "A child's joy is our responsibility." At JOYCO, we are committed to creating a society where violence against children is eradicated through advocacy and legal assistance.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Head Office</h4>
          <p className="flex gap-2 text-primary-foreground/80 text-sm leading-relaxed">
            <MapPin className="h-4 w-4 shrink-0 mt-1" />
            CHANGARAWE Street, nearby MZUMBE ward, Mvomero District, Morogoro Region, P.O. BOX 6083.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-1" /><a href="mailto:info@joyforthechildren.org" className="hover:text-accent">info@joyforthechildren.org</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-1" /><a href="mailto:abbasflugaenda@joyforthechildren.org" className="hover:text-accent break-all">abbasflugaenda@joyforthechildren.org</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-narrow py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Joy for the Children (JOYCO). All rights reserved.</p>
          <p>
            <Link to="/" className="hover:text-accent">Home</Link> · <Link to="/our-team" className="hover:text-accent">Team</Link> · <Link to="/admin" className="hover:text-accent">Admin Portal</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
