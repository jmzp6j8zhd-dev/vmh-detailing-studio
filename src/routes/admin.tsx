import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Check, LogOut, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { contentQuery, mediaQuery, defaultContent, type SiteContent, type MediaItem } from "@/lib/site-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  ssr: false,
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Beheer | VMH Carcleaning" },
      { name: "description", content: "Beheerpaneel van VMH Carcleaning." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Beheer | VMH Carcleaning" },
      { property: "og:description", content: "Beheerpaneel van VMH Carcleaning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const input = "w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none focus:border-primary";
const btn = "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-60";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:opacity-90`;
const btnGhost = `${btn} border border-border hover:border-primary`;

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (session === undefined) return <Shell><p className="text-muted-foreground">Laden…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (isAdmin === null) return <Shell><p className="text-muted-foreground">Laden…</p></Shell>;
  if (!isAdmin) return (
    <Shell>
      <p>Dit account ({session.user.email}) heeft geen toegang tot het beheer.</p>
      <button className={`${btnGhost} mt-4`} onClick={() => supabase.auth.signOut()}>Afmelden</button>
    </Shell>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-display text-lg font-black italic uppercase">Beheer</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className={btnGhost}>Naar de site</Link>
            <button className={btnGhost} onClick={() => supabase.auth.signOut()}><LogOut size={16} /> Afmelden</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="aanvragen">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="aanvragen">Aanvragen</TabsTrigger>
            <TabsTrigger value="teksten">Prijzen & teksten</TabsTrigger>
            <TabsTrigger value="media">Foto's & filmpjes</TabsTrigger>
          </TabsList>
          <TabsContent value="aanvragen" className="mt-6"><Quotes /></TabsContent>
          <TabsContent value="teksten" className="mt-6"><ContentEditor /></TabsContent>
          <TabsContent value="media" className="mt-6"><MediaManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">{children}</div>
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("Inloggen mislukt. Controleer e-mail en wachtwoord.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error("Account aanmaken lukt niet. Controleer je gegevens of probeer het later opnieuw.");
      else toast.success("Account aangemaakt. Klik op de link in je mailbox om te bevestigen.");
    }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <h1 className="font-display text-xl font-black italic uppercase">{mode === "in" ? "Inloggen" : "Account aanmaken"}</h1>
      <input name="email" type="email" required placeholder="E-mail" className={input} />
      <input name="password" type="password" required minLength={8} placeholder="Wachtwoord (min. 8 tekens)" className={input} />
      <button disabled={busy} className={`${btnPrimary} w-full`}>{busy ? "Bezig…" : mode === "in" ? "Inloggen" : "Account aanmaken"}</button>
      <button type="button" className="w-full text-sm text-muted-foreground hover:text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Eerste keer? Account aanmaken" : "Ik heb al een account"}
      </button>
    </form>
  );
}

type Quote = { id: string; created_at: string; name: string; phone: string; car: string | null; package: string | null; message: string | null; handled: boolean };

function Quotes() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Quote[];
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["quotes"] });
  async function toggle(q: Quote) { await supabase.from("quotes").update({ handled: !q.handled }).eq("id", q.id); refresh(); }
  async function remove(q: Quote) { if (!confirm(`Aanvraag van ${q.name} verwijderen?`)) return; await supabase.from("quotes").delete().eq("id", q.id); refresh(); }

  if (isLoading) return <p className="text-muted-foreground">Laden…</p>;
  if (!data.length) return <p className="text-muted-foreground">Nog geen aanvragen binnen.</p>;
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{data.filter((q) => !q.handled).length} open · {data.length} totaal</p>
      {data.map((q) => (
        <div key={q.id} className={`rounded-lg border p-4 ${q.handled ? "border-border opacity-60" : "border-primary/60 bg-card"}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{q.name} · <a href={`tel:${q.phone}`} className="text-primary">{q.phone}</a></p>
              <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString("nl-BE")}</p>
            </div>
            <div className="flex gap-2">
              <a href={`https://wa.me/${q.phone.replace(/\D/g, "").replace(/^0/, "32")}`} target="_blank" rel="noreferrer" className={btnGhost}>WhatsApp</a>
              <button onClick={() => toggle(q)} className={btnGhost}><Check size={16} />{q.handled ? "Heropenen" : "Afgehandeld"}</button>
              <button onClick={() => remove(q)} className={btnGhost} aria-label="Verwijderen"><Trash2 size={16} /></button>
            </div>
          </div>
          <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
            {q.car && <div><dt className="inline text-muted-foreground">Wagen: </dt><dd className="inline">{q.car}</dd></div>}
            {q.package && <div><dt className="inline text-muted-foreground">Pakket: </dt><dd className="inline">{q.package}</dd></div>}
          </dl>
          {q.message && <p className="mt-2 whitespace-pre-wrap text-sm">{q.message}</p>}
        </div>
      ))}
    </div>
  );
}

function ContentEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(contentQuery);
  const [c, setC] = useState<SiteContent | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data && !c) setC(structuredClone(data)); }, [data, c]);
  if (!c) return <p className="text-muted-foreground">Laden…</p>;

  const set = (patch: Partial<SiteContent>) => setC({ ...c, ...patch });
  async function save() {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert({ key: "main", value: c as never, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { toast.error("Opslaan mislukt."); return; }
    toast.success("Opgeslagen. De site is bijgewerkt.");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="font-display text-lg font-extrabold uppercase">Bovenaan de site</h2>
        <Field label="Titel (wit)"><input className={input} value={c.heroTitle1} onChange={(e) => set({ heroTitle1: e.target.value })} /></Field>
        <Field label="Titel (blauw)"><input className={input} value={c.heroTitle2} onChange={(e) => set({ heroTitle2: e.target.value })} /></Field>
        <Field label="Tekst"><textarea rows={3} className={input} value={c.heroText} onChange={(e) => set({ heroText: e.target.value })} /></Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold uppercase">Pakketten</h2>
        {c.packages.map((p, i) => {
          const upd = (patch: Partial<typeof p>) => set({ packages: c.packages.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
          return (
            <div key={i} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-3">
              <Field label="Naam"><input className={input} value={p.name} onChange={(e) => upd({ name: e.target.value })} /></Field>
              <Field label="Korte tekst boven de naam"><input className={input} value={p.sub} onChange={(e) => upd({ sub: e.target.value })} /></Field>
              <Field label="Prijs"><input className={input} value={p.price} onChange={(e) => upd({ price: e.target.value })} /></Field>
              <div className="sm:col-span-3">
                <Field label="Wat zit erin (één per regel)">
                  <textarea rows={5} className={input} value={p.items.join("\n")} onChange={(e) => upd({ items: e.target.value.split("\n") })} />
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-3">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.featured} onChange={(e) => upd({ featured: e.target.checked })} /> In de kijker zetten</label>
                <button className={btnGhost} onClick={() => confirm(`Pakket "${p.name}" verwijderen?`) && set({ packages: c.packages.filter((_, j) => j !== i) })}><Trash2 size={16} /> Verwijderen</button>
              </div>
            </div>
          );
        })}
        <button className={btnGhost} onClick={() => set({ packages: [...c.packages, { name: "Nieuw pakket", sub: "", price: "Vanaf € ", items: [] }] })}><Plus size={16} /> Pakket toevoegen</button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-extrabold uppercase">Polijsten & coatings</h2>
        <p className="text-sm text-muted-foreground">Deze diensten tonen altijd "Prijs op aanvraag".</p>
        {c.onDemand.map((o, i) => {
          const upd = (patch: Partial<typeof o>) => set({ onDemand: c.onDemand.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
          return (
            <div key={i} className="grid gap-3 rounded-lg border border-border p-4">
              <Field label="Naam"><input className={input} value={o.name} onChange={(e) => upd({ name: e.target.value })} /></Field>
              <Field label="Uitleg"><textarea rows={2} className={input} value={o.desc} onChange={(e) => upd({ desc: e.target.value })} /></Field>
              <button className={`${btnGhost} justify-self-start`} onClick={() => set({ onDemand: c.onDemand.filter((_, j) => j !== i) })}><Trash2 size={16} /> Verwijderen</button>
            </div>
          );
        })}
        <button className={btnGhost} onClick={() => set({ onDemand: [...c.onDemand, { name: "Nieuwe dienst", desc: "" }] })}><Plus size={16} /> Dienst toevoegen</button>
      </section>

      <div className="sticky bottom-0 flex gap-2 border-t border-border bg-background/95 py-3">
        <button disabled={busy} onClick={save} className={btnPrimary}>{busy ? "Opslaan…" : "Wijzigingen opslaan"}</button>
        <button className={btnGhost} onClick={() => confirm("Alles terugzetten naar de originele teksten?") && setC(structuredClone(defaultContent))}>Origineel terugzetten</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1 text-sm"><span className="text-muted-foreground">{label}</span>{children}</label>;
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
async function uploadFile(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2;
  return data.signedUrl;
}

function MediaManager() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(mediaQuery);
  const [busy, setBusy] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["media"] });

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File;
    const poster = f.get("poster") as File;
    if (!file?.size) return;
    const kind = file.type.startsWith("video") ? "video" : "image";
    if (kind === "video" && file.type !== "video/mp4") { toast.error("Gebruik een MP4-filmpje, dat speelt op elk toestel."); return; }
    setBusy(true);
    try {
      const url = await uploadFile(file);
      const poster_url = kind === "video" && poster?.size ? await uploadFile(poster) : null;
      const sort = Math.max(0, ...data.map((m) => m.sort)) + 1;
      const { error } = await supabase.from("media").insert({ kind, url, poster_url, alt: String(f.get("alt") || ""), sort });
      if (error) throw error;
      form.reset();
      toast.success("Toegevoegd aan Resultaten.");
      refresh();
    } catch {
      toast.error("Uploaden mislukt. Bestanden mogen maximaal 50 MB zijn.");
    }
    setBusy(false);
  }

  async function move(m: MediaItem, dir: -1 | 1) {
    const i = data.findIndex((x) => x.id === m.id);
    const other = data[i + dir];
    if (!other) return;
    await Promise.all([
      supabase.from("media").update({ sort: other.sort }).eq("id", m.id),
      supabase.from("media").update({ sort: m.sort }).eq("id", other.id),
    ]);
    refresh();
  }
  async function remove(m: MediaItem) {
    if (!confirm("Dit item van de site halen?")) return;
    await supabase.from("media").delete().eq("id", m.id);
    refresh();
  }
  async function saveAlt(m: MediaItem, alt: string) {
    if (alt === m.alt) return;
    await supabase.from("media").update({ alt }).eq("id", m.id);
    toast.success("Beschrijving opgeslagen.");
    refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="space-y-3 rounded-lg border border-border bg-card p-4">
        <h2 className="font-display text-lg font-extrabold uppercase">Nieuwe foto of filmpje</h2>
        <Field label="Foto (JPG/PNG) of filmpje (MP4)"><input name="file" type="file" required accept="image/*,video/mp4" className={input} /></Field>
        <Field label="Omslagfoto voor het filmpje (niet verplicht)"><input name="poster" type="file" accept="image/*" className={input} /></Field>
        <Field label="Korte beschrijving"><input name="alt" placeholder="bv. Gereinigd interieur BMW X5" className={input} /></Field>
        <button disabled={busy} className={btnPrimary}><Upload size={16} />{busy ? "Bezig met uploaden…" : "Uploaden"}</button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((m, i) => (
          <div key={m.id} className="space-y-2 rounded-lg border border-border p-3">
            {m.kind === "image"
              ? <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full rounded object-cover" />
              : <video src={m.url} poster={m.poster_url ?? undefined} controls playsInline preload="none" className="aspect-[4/3] w-full rounded bg-background object-contain" />}
            <input defaultValue={m.alt} onBlur={(e) => saveAlt(m, e.target.value)} className={input} aria-label="Beschrijving" />
            <div className="flex gap-2">
              <button disabled={i === 0} onClick={() => move(m, -1)} className={btnGhost} aria-label="Naar voor"><ArrowUp size={16} /></button>
              <button disabled={i === data.length - 1} onClick={() => move(m, 1)} className={btnGhost} aria-label="Naar achter"><ArrowDown size={16} /></button>
              <button onClick={() => remove(m)} className={`${btnGhost} ml-auto`} aria-label="Verwijderen"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
