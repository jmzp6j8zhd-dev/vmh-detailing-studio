import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, Mail, MessageCircle, Instagram, MapPin, Check } from "lucide-react";
import logo from "@/assets/vmh_logo.jpg.asset.json";
import hero from "@/assets/hero-car.jpg";
import polish from "@/assets/result-polish.jpg";
import interior from "@/assets/result-interior.jpg";

const PHONE = "0495 635 210";
const TEL = "tel:+32495635210";
const WA = "https://wa.me/32495635210";
const EMAIL = "vanmeerhaegheyoran@gmail.com";
const IG = "https://instagram.com/vmh.carcleaning";
const ADDRESS = "Baronielaan 65, 8870 Izegem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VMH Carcleaning | Polijst- & Detailingservices Izegem" },
      { name: "description", content: "Handwas, lakcorrectie, interieurreiniging en keramische coating in Izegem. Vraag je offerte aan bij VMH Carcleaning." },
      { property: "og:title", content: "VMH Carcleaning | Detailing in Izegem" },
      { property: "og:description", content: "Professionele polijst- en detailingservices. Prijs op aanvraag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const packages = [
  { name: "Essential", sub: "Wash & Care", price: "Vanaf € 49", items: ["Grondige handwas", "Velgenreiniging", "Stofzuigen interieur", "Ramen reinigen", "Waxbescherming"] },
  { name: "Paint Correction", sub: "Deep Clean", price: "Vanaf € 249", featured: true, items: ["1-staps polijstbeurt", "Swirls verwijderen", "Diepe glans", "Intensieve interieurbehandeling"] },
  { name: "Full Signature", sub: "Detail", price: "Prijs op aanvraag", items: ["Meer-staps lakcorrectie", "Dieptereiniging bekleding & leder", "Sealant of keramische coating", "Langdurige lakbescherming"] },
];

function Btn({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition ${primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border bg-secondary/60 text-foreground hover:border-primary"}`}>
      {children}
    </a>
  );
}

function Index() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Naam: ${f.get("name")}\nTel: ${f.get("phone")}\nWagen: ${f.get("car")}\nPakket: ${f.get("pkg")}\n\n${f.get("msg")}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Offerte / afspraak – " + f.get("name"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <img src={logo.url} alt="VMH Carcleaning logo" className="h-12 w-auto" />
          <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
            <a href="#diensten" className="hover:text-foreground">Diensten</a>
            <a href="#resultaten" className="hover:text-foreground">Resultaten</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <a href={TEL} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Bel nu</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img src={hero} alt="Polijsten van een zwarte wagen" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Polijst- & detailingservices · Izegem</p>
          <h1 className="max-w-2xl font-display text-5xl font-black italic uppercase leading-[0.95] md:text-7xl">
            Showroomglans,<br /><span className="text-primary">elke keer.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">Van een grondige handwas tot meer-staps lakcorrectie en keramische coating. Met oog voor elk detail door Yoran.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href={TEL} primary><Phone size={16} /> {PHONE}</Btn>
            <Btn href={WA}><MessageCircle size={16} /> WhatsApp</Btn>
            <Btn href={`mailto:${EMAIL}`}><Mail size={16} /> E-mail</Btn>
          </div>
        </div>
      </section>

      <section id="diensten" className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="font-display text-4xl font-black italic uppercase">Pakketten</h2>
        <p className="mt-2 text-muted-foreground">Elke wagen is anders. Prijzen zijn indicatief, contacteer ons voor een offerte op maat.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-lg border p-7 ${p.featured ? "border-primary bg-card shadow-[0_0_40px_-10px_var(--primary)]" : "border-border bg-card"}`}>
              <p className="text-xs uppercase tracking-widest text-primary">{p.sub}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold uppercase">{p.name}</h3>
              <p className="mt-4 text-xl font-semibold">{p.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {p.items.map((i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{i}</li>)}
              </ul>
              <a href="#contact" className={`mt-8 rounded-md py-3 text-center text-sm font-semibold ${p.featured ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary"}`}>Offerte aanvragen</a>
            </div>
          ))}
        </div>
      </section>

      <section id="resultaten" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="font-display text-4xl font-black italic uppercase">Resultaten</h2>
          <p className="mt-2 text-muted-foreground">Meer werk zien? Volg <a href={IG} target="_blank" rel="noreferrer" className="text-primary">@vmh.carcleaning</a> op Instagram.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <img src={hero} alt="Lakcorrectie" loading="lazy" className="h-72 w-full rounded-lg object-cover md:col-span-2" />
            <img src={polish} alt="Polijsten met diepe glans" loading="lazy" width={1024} height={1024} className="h-72 w-full rounded-lg object-cover" />
            <img src={interior} alt="Gereinigd lederen interieur" loading="lazy" width={1024} height={1024} className="h-72 w-full rounded-lg object-cover" />
            <div className="flex h-72 flex-col justify-center rounded-lg border border-border p-8 md:col-span-2">
              <p className="font-display text-3xl font-black italic uppercase">Swirls weg. <span className="text-primary">Glans terug.</span></p>
              <p className="mt-3 text-muted-foreground">Professionele producten, machinaal polijsten en langdurige bescherming.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-black italic uppercase">Contact</h2>
          <p className="mt-2 text-muted-foreground">Vraag een offerte aan of plan een afspraak.</p>
          <ul className="mt-8 space-y-4">
            <li><a href={TEL} className="flex items-center gap-3 hover:text-primary"><Phone size={18} className="text-primary" />{PHONE}</a></li>
            <li><a href={WA} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle size={18} className="text-primary" />WhatsApp</a></li>
            <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-3 break-all hover:text-primary"><Mail size={18} className="text-primary" />{EMAIL}</a></li>
            <li><a href={IG} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><Instagram size={18} className="text-primary" />vmh.carcleaning</a></li>
            <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" />{ADDRESS}</li>
          </ul>
          <iframe title="Kaart" className="mt-8 h-64 w-full rounded-lg border border-border grayscale invert-[0.9]" loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&output=embed`} />
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-7">
          <h3 className="font-display text-xl font-extrabold uppercase">Offerte of afspraak</h3>
          {[["name", "Naam"], ["phone", "GSM"], ["car", "Merk & model wagen"]].map(([n, l]) => (
            <input key={n} name={n} required={n !== "car"} placeholder={l} className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          ))}
          <select name="pkg" className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm">
            {packages.map((p) => <option key={p.name}>{p.name}</option>)}
            <option>Weet ik nog niet</option>
          </select>
          <textarea name="msg" rows={4} placeholder="Bericht / gewenste datum" className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          <button className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Verstuur aanvraag</button>
          {sent && <p className="text-sm text-primary">Je e-mailprogramma wordt geopend om de aanvraag te versturen.</p>}
        </form>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VMH Carcleaning · {ADDRESS} · {PHONE}
      </footer>
    </div>
  );
}
