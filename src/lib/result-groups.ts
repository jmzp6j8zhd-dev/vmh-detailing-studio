import type { MediaItem } from "./site-content";

const projects = [
  { title: "MG · interieur", files: ["resultaat-video-2.mp4", "resultaat-video-4.mp4", "interieur-mg-voetenruimte.jpg"] },
  { title: "Mercedes · interieur", files: ["interieur-mercedes-cognac.jpg", "interieur-voetenruimte-amg.jpg"] },
  { title: "Range Rover · interieur", files: ["interieur-range-rover-creme.jpg", "resultaat-video-3.mp4"] },
  { title: "Lakglans", files: ["exterieur-hoogglans-lak.jpg", "resultaat-video-1.mp4"] },
];

export function groupResults(media: MediaItem[]) {
  const used = new Set<string>();
  const groups = projects.map((project) => {
    const items = project.files.flatMap((filename) => {
      const item = media.find((m) => m.url.split("?")[0]?.endsWith(`/${filename}`));
      if (!item) return [];
      used.add(item.id);
      const label = filename === "resultaat-video-2.mp4" ? "Vóór" : filename === "resultaat-video-4.mp4" ? "Na" : item.kind === "image" ? "Foto" : "Filmpje";
      return [{ ...item, label }];
    });
    return { title: project.title, items };
  }).filter((group) => group.items.length > 0);
  const remaining = media.filter((m) => !used.has(m.id));
  if (remaining.length) groups.push({ title: "Meer resultaten", items: remaining.map((m) => ({ ...m, label: m.kind === "image" ? "Foto" : "Filmpje" })) });
  return groups;
}