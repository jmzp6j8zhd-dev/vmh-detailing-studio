import { supabase } from "@/integrations/supabase/client";

export type Pkg = { name: string; sub: string; price: string; featured?: boolean; items: string[] };
export type OnDemand = { name: string; desc: string };
export type SiteContent = {
  heroTitle1: string;
  heroTitle2: string;
  heroText: string;
  packages: Pkg[];
  onDemand: OnDemand[];
};
export type MediaItem = { id: string; kind: "image" | "video"; url: string; poster_url: string | null; alt: string; sort: number };

export const defaultContent: SiteContent = {
  heroTitle1: "Showroomglans,",
  heroTitle2: "elke keer.",
  heroText: "Van een grondige interieurreiniging tot een gewassen en verzegelde wagen. Met oog voor elk detail.",
  packages: [
    { name: "Exterieurpakket", sub: "Van buiten", price: "Vanaf € 45", items: [
      "Voorwas om los vuil zacht af te spoelen",
      "Handwas met shampoo en washandschoen",
      "Velgen en dorpels grondig reinigen",
      "Verzegeling: water en vuil rolen makkelijker af",
      "Ramen buiten streepvrij en droog afwerken",
    ] },
    { name: "Interieurpakket", sub: "Van binnen", price: "Vanaf € 75", items: [
      "Volledig stofzuigen: zetels, vloer, koffer en hoeken",
      "Dashboard, portieren en middenconsole reinigen",
      "Bekleding en bekledingsnaden diep reinigen",
      "Ramen binnen streepvrij maken",
      "Kunststof & leder verzorgen, interieur fris maken",
    ] },
    { name: "Interieur + Exterieur", sub: "Combi", price: "€ 99", featured: true, items: [
      "Alles uit het interieurpakket",
      "Alles uit het exterieurpakket",
      "Eén afspraak, één prijs",
      "Wagen terug als nieuw, binnen en buiten",
    ] },
  ],
  onDemand: [
    { name: "Lakcorrectie", desc: "Meer-staps polijsten: swirls, krasjes en matte lak aangepakt voor een diepe glans." },
    { name: "Keramische coating", desc: "Langdurige lakbescherming met een hard, glanzend laagje." },
    { name: "Sealant", desc: "Krachtige verzegeling met lange standtijd, perfect als onderhoud." },
  ],
};

export const contentQuery = {
  queryKey: ["site_content"],
  queryFn: async (): Promise<SiteContent> => {
    const { data } = await supabase.from("site_content").select("value").eq("key", "main").maybeSingle();
    return { ...defaultContent, ...((data?.value as Partial<SiteContent>) ?? {}) };
  },
};

export const mediaQuery = {
  queryKey: ["media"],
  queryFn: async (): Promise<MediaItem[]> => {
    const { data, error } = await supabase.from("media").select("*").order("sort");
    if (error) throw error;
    return (data ?? []) as MediaItem[];
  },
};
