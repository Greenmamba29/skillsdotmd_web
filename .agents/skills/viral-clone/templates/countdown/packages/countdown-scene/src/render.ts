import { sealVisualTrack } from "@hypit/composition";
import type { VisualElement } from "@hypit/composition";
import { htmlVisual } from "@hypit/html-program";
import type { FontStackRef } from "@hypit/media";
import type { Timeline } from "@hypit/timeline";
import type { SpatialFrame } from "@hypit/spatial";
import { assertTemporalWindowFor } from "@hypit/temporal";
import type { TemporalInstant, TemporalWindow } from "@hypit/temporal";

/** One full-screen card of the countdown. `rank` is empty for intro/outro cards. */
export type Card = { id: string; rank: string; eyebrow: string; title: string; body: string; note: string; footer: string; at: TemporalInstant };
export type CountdownOptions = { id: string; brand: string; entranceFrames: number };

/** Cards replace each other on their authored Instants; every frame is computed directly from the frame number. */
export function renderCountdown(timeline: Timeline, within: SpatialFrame, window: TemporalWindow,
  font: FontStackRef, cards: readonly Card[], options: CountdownOptions) {
  assertTemporalWindowFor(window, { subjectId: options.id, timeline });
  if (!Number.isSafeInteger(options.entranceFrames) || options.entranceFrames < 1) throw new Error("Countdown entrance-frames must be a positive integer.");
  if (cards.some(card => card.at.frame < window.span.startFrame || card.at.frame >= window.span.endFrameExclusive)) throw new Error("Countdown cards must start inside the scene's window.");
  const scale = within.widthPx / 720;
  let order = 0;
  const text = (id: string, value: string, size: number, color: string): VisualElement => ({
    id, kind: "text", parent: "countdown", order: ++order, text: value, fonts: font.faces,
    style: [{ name: "font-size", value: `${Math.round(size * scale)}px` }, { name: "line-height", value: 1.18 },
      { name: "color", value: color }],
  });
  const ranked = cards.filter(card => card.rank !== "");
  const children: VisualElement[] = [text("brand", options.brand, 22, "#e9d8b4")];
  cards.forEach((card, i) => {
    if (card.rank) children.push(text(`rank-${i}`, card.rank, 230, "#e23b2e"));
    children.push(text(`eyebrow-${i}`, card.eyebrow, 26, "#e9d8b4"), text(`title-${i}`, card.title, card.rank ? 76 : 64, "#fbf5ea"),
      text(`body-${i}`, card.body, 35, "#f1e9dc"));
    if (card.note) children.push(text(`note-${i}`, card.note, 31, "#121212"));
    if (card.footer) children.push(text(`footer-${i}`, card.footer, 19, "#a99f90"));
  });
  const markup = cards.map((card, i) => `<section class="card${card.rank ? " ranked" : ""}" data-card="${i}">
    ${card.rank ? `<div class="rank">{{rank-${i}}}</div>` : `<div class="rule"></div>`}
    <div class="eyebrow">{{eyebrow-${i}}}</div><div class="title">{{title-${i}}}</div><div class="body">{{body-${i}}}</div>
    ${card.note ? `<div class="note">{{note-${i}}}</div>` : ""}${card.footer ? `<div class="footer">{{footer-${i}}}</div>` : ""}</section>`).join("");
  const s = (px: number) => `${Math.round(px * scale)}px`;
  const program = htmlVisual({
    html: `<div class="grain"></div><header><div class="brand">{{brand}}</div><div class="pips">${ranked.map((_, i) => `<i data-pip="${i}"></i>`).join("")}</div></header>${markup}<div class="bar"><b></b></div>`,
    css: `:scope{background:#121110;overflow:hidden}
      .grain{position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 0%,#2a1f19 0%,#121110 62%);}
      header{position:absolute;left:${s(44)};right:${s(44)};top:${s(56)};display:flex;justify-content:space-between;align-items:center;z-index:3}
      .brand{letter-spacing:.24em}.pips{display:flex;gap:${s(10)}}.pips i{width:${s(34)};height:${s(7)};border-radius:${s(4)};background:#3b332c}
      .pips i.on{background:#e23b2e}
      .card{position:absolute;left:${s(44)};right:${s(44)};top:${s(150)};bottom:${s(120)};display:none;flex-direction:column;justify-content:center}
      .rank{line-height:.82;margin-bottom:${s(10)};text-shadow:0 ${s(10)} 0 #3a0f0b}
      .rule{width:${s(90)};height:${s(10)};background:#e23b2e;margin-bottom:${s(34)}}
      .eyebrow{letter-spacing:.14em;text-transform:uppercase;margin-bottom:${s(14)}}
      .title{margin-bottom:${s(26)};text-transform:uppercase;letter-spacing:-.01em}
      .body{margin-bottom:${s(30)};max-width:96%}
      .note{background:#e9d8b4;padding:${s(18)} ${s(22)};border-radius:${s(6)};box-shadow:${s(8)} ${s(8)} 0 #e23b2e;align-self:flex-start;max-width:92%}
      .footer{position:absolute;left:0;right:0;bottom:0;border-top:1px solid #3b332c;padding-top:${s(14)}}
      .bar{position:absolute;left:0;right:0;bottom:0;height:${s(8)};background:#2a2420}.bar b{display:block;height:100%;width:0;background:#e23b2e}`,
    data: { times: cards.map(card => card.at.frame - window.span.startFrame), ranked: cards.map(card => card.rank !== ""),
      end: window.span.endFrameExclusive - window.span.startFrame, entrance: options.entranceFrames },
    setup: `const cards=[...root.querySelectorAll('.card')], pips=[...root.querySelectorAll('.pips i')], bar=root.querySelector('.bar b');
      const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
      const set=(el,o,y,sc)=>{if(!el)return;el.style.opacity=String(o);el.style.transform='translateY('+y+'px) scale('+(sc??1)+')';};
      return frame=>{
        let current=-1; data.times.forEach((t,i)=>{if(frame>=t)current=i;});
        let seen=0;
        cards.forEach((card,i)=>{
          const start=data.times[i], end=i+1<data.times.length?data.times[i+1]:data.end, on=i===current;
          card.style.display=on?'flex':'none'; if(!on)return;
          const age=frame-start, len=end-start, e=data.entrance;
          const out=ease((age-(len-e*0.6))/(e*0.6));
          card.style.opacity=String(1-out);
          set(card.querySelector('.rank'),ease(age/e),0,1.6-0.6*ease(age/(e*0.8)));
          set(card.querySelector('.rule'),ease(age/e),0);
          set(card.querySelector('.eyebrow'),ease((age-e*0.3)/e),14*(1-ease((age-e*0.3)/e)));
          set(card.querySelector('.title'),ease((age-e*0.5)/e),26*(1-ease((age-e*0.5)/e)));
          set(card.querySelector('.body'),ease((age-e*1.1)/e),18*(1-ease((age-e*1.1)/e)));
          const noteAt=Math.round(len*0.45); set(card.querySelector('.note'),ease((age-noteAt)/e),22*(1-ease((age-noteAt)/e)),0.96+0.04*ease((age-noteAt)/e));
          set(card.querySelector('.footer'),ease((age-e*1.6)/e)*0.95,0);
        });
        data.ranked.forEach((r,i)=>{if(r&&i<=current)seen++;});
        pips.forEach((p,i)=>p.classList.toggle('on',i<seen));
        bar.style.width=(100*Math.min(1,frame/data.end))+'%';
      };`,
  });
  return sealVisualTrack({ id: options.id, timelineId: timeline.id, visualIr: "hypit.visual-ir@1",
    presents: [{ id: options.id, order: 0, z: 0, span: window.span,
      elements: [{ id: "countdown", kind: "program", order: 0, program,
        style: [{ name: "position", value: "absolute" }, { name: "left", value: `${within.xPx}px` },
          { name: "top", value: `${within.yPx}px` },
          { name: "width", value: `${within.widthPx}px` }, { name: "height", value: `${within.heightPx}px` }] }, ...children] }] });
}
