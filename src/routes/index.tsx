import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  MapPin,
  Check,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/vmh_logo.jpg.asset.json";
import hero from "@/assets/hero-car.jpg";
import shotMercedes from "@/assets/interieur-mercedes-cognac.jpg.asset.json";
import shotLak from "@/assets/exterieur-hoogglans-lak.jpg.asset.json";
import shotAmg from "@/assets/interieur-voetenruimte-amg.jpg.asset.json";
import shotRangeRover from "@/assets/interieur-range-rover-creme.jpg.asset.json";
import shotMg from "@/assets/interieur-mg-voetenruimte.jpg.asset.json";

const PHONE = "0495 635 210";
const TEL = "tel:+32495635210";
const WA = "https://wa.me/32495635210";
const EMAIL = "vanmeerhaegheyoran@gmail.com";
const IG = "https://instagram.com/vmh.carcleaning";
const ADDRESS = "Baronielaan 65, 8870 Izegem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VMH Carcleaning | Interieur- & exterieurreiniging Izegem" },
      { name: "description", content: "Interieurreiniging vanaf € 75, exterieur vanaf € 45 en de combi voor € 99 in Izegem. Polijsten en coatings op aanvraag. Vraag je offerte aan bij VMH Carcleaning." },
      { property: "og:title", content: "VMH Carcleaning | Interieur- & exterieurreiniging in Izegem" },
      { property: "og:description", content: "Interieur vanaf € 75, exterieur vanaf € 45, combi € 99. Polijsten en coatings op aanvraag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const packages = [
  {
    name: "Exterieurpakket",
    sub: "Van buiten",
    price: "Vanaf € 45",
    items: [
      "Voorwas om los vuil zacht af te spoelen",
      "Handwas met shampoo en washandschoen",
      "Velgen en dorpels grondig reinigen",
      "Verzegeling: water en vuil rolen makkelijker af",
      "Ramen buiten streepvrij en droog afwerken",
    ],
  },
  {
    name: "Interieurpakket",
    sub: "Van binnen",
    price: "Vanaf € 75",
    items: [
      "Volledig stofzuigen: zetels, vloer, koffer en hoeken",
      "Dashboard, portieren en middenconsole reinigen",
      "Bekleding en bekledingsnaden diep reinigen",
      "Ramen binnen streepvrij maken",
      "Kunststof & leder verzorgen, interieur fris maken",
    ],
  },
  {
    name: "Interieur + Exterieur",
    sub: "Combi",
    price: "€ 99",
    featured: true,
    items: [
      "Alles uit het interieurpakket",
      "Alles uit het exterieurpakket",
      "Eén afspraak, één prijs",
      "Wagen terug als nieuw, binnen en buiten",
    ],
  },
];

const results = [
  { img: shotMercedes, alt: "Gereinigd Mercedes-interieur met cognac lederen bekleding" },
  { img: shotLak, alt: "Hoogglans gepoetste lak met spiegelende weerspiegeling" },
  { img: shotAmg, alt: "Net gereinigde voetenruimte met AMG-vloermat" },
  { img: shotRangeRover, alt: "Crème lederen zetels en middenconsole, grondig gereinigd" },
  { img: shotMg, alt: "Gereinigde voetenruimte met leder en oranje stiksels" },
];

const onDemand = [
  { name: "Lakcorrectie", desc: "Meer-staps polijsten: swirls, krasjes en matte lak aangepakt voor een diepe glans." },
  { name: "Keramische coating", desc: "Langdurige lakbescherming met een hard, glanzend laagje." },
  { name: "Sealant", desc: "Krachtige verzegeling met lange standtijd, perfect als onderhoud." },
];

const navLinks = [
  ["#pakketten", "Pakketten"],
  ["#polijsten", "Polijsten & coatings"],
  ["#resultaten", "Resultaten"],
  ["#contact", "Contact"],
];

function Btn({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition ${primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border bg-secondary/60 text-foreground hover:border-primary"}`}>
      {children}
    </a>
  );
}

function Index() {
  const [sent, setSent] = useState(false);
  const [menu, setMenu] = useState(false);

  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setStatus("busy");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nieuwe offerteaanvraag – ${f.get("name")}`,
          _template: "table",
          _captcha: "false",
          Naam: f.get("name"),
          GSM: f.get("phone"),
          Wagen: f.get("car"),
          Pakket: f.get("pkg"),
          Bericht: f.get("msg"),
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setSent(true);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-dvh bg-background font-sans text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <img src={logo.url} alt="Logo VMH Carcleaning" className="h-10 w-auto sm:h-12" />
          <nav className="hidden gap-7 text-sm text-muted-foreground md:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-foreground">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={TEL} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Bel nu</a>
            <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu}
              aria-label={menu ? "Menu sluiten" : "Menu openen"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden">
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}
                className="block rounded-md px-3 py-3 text-sm text-foreground/90 hover:bg-secondary/60 hover:text-primary">
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="relative overflow-hidden">
        <img src={hero} alt="Polijsten van een zwarte wagen" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-5 sm:py-28 lg:py-40">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary sm:text-xs sm:tracking-[0.3em]">Interieur- & exterieurreiniging · Izegem</p>
          <h1 className="max-w-2xl font-display text-[length:clamp(1.55rem,8vw,3.4rem)] font-black italic uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            Showroomglans,<br /><span className="text-primary">elke keer.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">Van een grondige interieurreiniging tot een gewassen en verzegelde wagen. Met oog voor elk detail.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn href={TEL} primary><Phone size={16} /> {PHONE}</Btn>
            <Btn href={WA}><MessageCircle size={16} /> WhatsApp</Btn>
            <Btn href={`mailto:${EMAIL}`}><Mail size={16} /> E-mail</Btn>
          </div>
        </div>
      </section>

      <section id="pakketten" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-5 sm:py-24">
        <h2 className="font-display text-3xl font-black italic uppercase sm:text-4xl">Pakketten</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Drie vaste pakketten, duidelijke prijzen. Elk pakket op maat gemaakt per wagen — stuur een foto van je wagen voor een exacte offerte.</p>
        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <div key={p.name} className={`flex flex-col rounded-lg border p-6 sm:p-7 ${p.featured ? "border-primary bg-card shadow-[0_0_40px_-10px_var(--primary)] sm:col-span-2 lg:col-span-1" : "border-border bg-card"}`}>
              <p className="text-xs uppercase tracking-widest text-primary">{p.sub}</p>
              <h3 className="mt-1 font-display text-xl font-extrabold uppercase sm:text-2xl">{p.name}</h3>
              <p className="mt-4 text-lg font-semibold sm:text-xl">{p.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {p.items.map((i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{i}</li>)}
              </ul>
              <a href="#contact" className={`mt-8 block rounded-md py-3 text-center text-sm font-semibold ${p.featured ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary"}`}>Offerte aanvragen</a>
            </div>
          ))}
        </div>
      </section>

      <section id="polijsten" className="scroll-mt-20 border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary sm:text-xs sm:tracking-[0.3em]">Meer dan een wasbeurt</p>
          <h2 className="mt-2 font-display text-3xl font-black italic uppercase sm:text-4xl">Polijsten & coatings</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Deze behandelingen kunnen we niet in één vaste prijs stoppen: elk lakwerk is anders. Prijs altijd op aanvraag, na het zien van je wagen.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {onDemand.map((o) => (
              <div key={o.name} className="rounded-lg border border-border bg-background/60 p-6">
                <Sparkles size={18} className="text-primary" />
                <h3 className="mt-3 font-display text-lg font-extrabold uppercase">{o.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
                <p className="mt-4 text-sm font-semibold text-primary">Prijs op aanvraag</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Btn href="#contact" primary><Mail size={16} /> Offerte op aanvraag</Btn>
            <Btn href={WA}><MessageCircle size={16} /> Stuur foto's via WhatsApp</Btn>
          </div>
        </div>
      </section>

      <section id="resultaten" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-5 sm:py-24">
        <h2 className="font-display text-3xl font-black italic uppercase sm:text-4xl">Resultaten</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Een greep uit recent werk: interieur en exterieur. Vuil weg. <span className="text-primary">Glans terug.</span></p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {results.map((r) => (
            <img key={r.alt} src={r.img.url} alt={r.alt} loading="lazy" className="aspect-[3/4] w-full rounded-lg object-cover" />
          ))}
          <a href={IG} target="_blank" rel="noreferrer"
            className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card/40 p-4 text-center transition hover:border-primary">
            <Instagram size={22} className="text-primary" />
            <p className="font-display text-sm font-extrabold uppercase sm:text-base">Meer werk op Instagram</p>
            <p className="text-xs text-muted-foreground">@vmh.carcleaning</p>
          </a>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-5 sm:py-24 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="font-display text-3xl font-black italic uppercase sm:text-4xl">Contact</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Vraag een offerte aan of plan een afspraak.</p>
            <ul className="mt-8 space-y-4 text-sm sm:text-base">
              <li><a href={TEL} className="flex items-center gap-3 hover:text-primary"><Phone size={18} className="shrink-0 text-primary" />{PHONE}</a></li>
              <li><a href={WA} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle size={18} className="shrink-0 text-primary" />WhatsApp</a></li>
              <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-3 break-all hover:text-primary"><Mail size={18} className="shrink-0 text-primary" />{EMAIL}</a></li>
              <li><a href={IG} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><Instagram size={18} className="shrink-0 text-primary" />vmh.carcleaning</a></li>
              <li className="flex items-center gap-3"><MapPin size={18} className="shrink-0 text-primary" />{ADDRESS}</li>
            </ul>
            <iframe title="Kaart met locatie Baronielaan 65, Izegem" className="mt-8 h-56 w-full rounded-lg border border-border grayscale invert-[0.9] sm:h-64" loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&hl=nl&output=embed`} />
          </div>
          <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-background p-5 sm:p-7">
            <h3 className="font-display text-lg font-extrabold uppercase sm:text-xl">Offerte of afspraak</h3>
            {[["name", "Naam"], ["phone", "GSM"], ["car", "Merk & model wagen"]].map(([n, l]) => (
              <input key={n} name={n} required={n !== "car"} placeholder={l} className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary" />
            ))}
            <select name="pkg" className="w-full rounded-md border border-input bg-background px-4 py-3 text-base">
              {packages.map((p) => <option key={p.name}>{p.name} – {p.price}</option>)}
              <option>Polijsten of coating – op aanvraag</option>
              <option>Weet ik nog niet</option>
            </select>
            <textarea name="msg" rows={4} placeholder="Bericht / gewenste datum" className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary" />
            <button disabled={status === "busy"} className="min-h-11 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{status === "busy" ? "Bezig met versturen…" : "Verstuur aanvraag"}</button>
            {sent && <p className="text-sm text-primary">Bedankt! Je aanvraag is verstuurd. We nemen snel contact met je op.</p>}
            {status === "error" && <p className="text-sm text-destructive">Versturen lukte niet. Bel of stuur een WhatsApp naar {PHONE}.</p>}
          </form>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground sm:text-sm">
        © {new Date().getFullYear()} VMH Carcleaning · {ADDRESS} · {PHONE}
      </footer>
    </div>
  );
}
