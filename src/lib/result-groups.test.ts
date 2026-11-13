import { describe, expect, it } from "vitest";
import { groupResults } from "./result-groups";
import type { MediaItem } from "./site-content";

const item = (filename: string): MediaItem => ({ id: filename, url: `/assets/${filename}`, kind: "video", poster_url: null, alt: "", sort: 1 });

describe("Resultaten per wagen", () => {
  it("zet het vuile MG-filmpje vóór het propere, onafhankelijk van de aangeleverde volgorde", () => {
    const groups = groupResults([item("resultaat-video-4.mp4"), item("resultaat-video-2.mp4")]);
    expect(groups[0].items.map((m) => m.id)).toEqual(["resultaat-video-2.mp4", "resultaat-video-4.mp4"]);
    expect(groups[0].items.map((m) => m.label)).toEqual(["Vóór", "Na"]);
  });
  it("behoudt nieuwe uploads en toont geen verwijderde beelden opnieuw", () => {
    const groups = groupResults([item("nieuw.mp4")]);
    expect(groups.flatMap((g) => g.items.map((m) => m.id))).toEqual(["nieuw.mp4"]);
  });
});