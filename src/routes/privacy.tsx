import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://www.vmhcarcleaning.com";
const TITLE = "Privacyverklaring | VMH Carcleaning";
const DESC = "Hoe VMH Carcleaning in Izegem omgaat met je gegevens wanneer je een offerte aanvraagt.";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: Privacy,
});

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-display text-xl font-extrabold uppercase">{children}</h2>;
}

function Privacy() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-5 sm:py-16">
        <Link to="/" className="text-sm text-primary hover:underline">← Terug naar de site</Link>
        <h1 className="mt-6 font-display text-3xl font-black italic uppercase sm:text-4xl">Privacyverklaring</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>Hier lees je welke gegevens we bewaren, waarom, en hoe lang. Laatst bijgewerkt op 15 november 2026.</p>

          <H>Wie zijn wij?</H>
          <p>VMH Carcleaning, Baronielaan 65, 8870 Izegem.<br />E-mail: <a className="text-primary" href="mailto:vanmeerhaegheyoran@gmail.com">vanmeerhaegheyoran@gmail.com</a> · GSM: <a className="text-primary" href="tel:+32495635210">0495 635 210</a></p>

          <H>Welke gegevens?</H>
          <p>Alleen wat je zelf invult in het aanvraagformulier: je naam, GSM-nummer, merk en model van je wagen, het gekozen pakket en je bericht.</p>

          <H>Waarom?</H>
          <p>Alleen om je aanvraag te beantwoorden en een afspraak te maken. Dat mag omdat je zelf om een offerte vraagt (stappen vóór een overeenkomst, art. 6.1.b AVG). We gebruiken je gegevens niet voor reclame en verkopen ze nooit door.</p>

          <H>Hoe lang?</H>
          <p>Aanvragen op de website worden na 1 maand automatisch verwijderd. Je aanvraag komt ook per e-mail bij ons binnen; die mail verwijderen we eveneens na 1 maand.</p>

          <H>Wie krijgt je gegevens nog?</H>
          <ul className="list-disc space-y-2 pl-5">
            <li>Onze websitehosting en database, waar de aanvraag veilig wordt opgeslagen.</li>
            <li>FormSubmit, een dienst die je aanvraag als e-mail naar ons doorstuurt.</li>
            <li>Google, alleen als je zelf op "Kaart tonen" klikt. Google kan dan cookies plaatsen. Zonder klik laadt er niets van Google.</li>
          </ul>

          <H>Cookies</H>
          <p>Deze website plaatst zelf geen cookies en volgt je niet. Er zijn geen statistiek- of reclamecookies.</p>

          <H>Jouw rechten</H>
          <p>Je mag altijd vragen welke gegevens we van je hebben, ze laten aanpassen of laten verwijderen. Stuur een mail of bel ons. Ben je niet tevreden, dan kun je een klacht indienen bij de Gegevensbeschermingsautoriteit (<a className="text-primary" href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noreferrer">gegevensbeschermingsautoriteit.be</a>).</p>
        </div>
      </main>
    </div>
  );
}
