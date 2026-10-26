import { assertAttributes, assertEmptyElement, createMarkupSurfaceFacet, textAttribute } from "@hypit/hypit/markup";
import { canonicalize, sameType } from "@hypit/hypit/protocol";
import { sealGraphFragment } from "@hypit/hypit/author";
import { createAdmissionPackageFacet } from "@hypit/hypit/admission";
import { createProducerPackageFacet } from "@hypit/hypit/producer";
import type { ProducerPackage } from "@hypit/hypit/producer";
import type { AdmissionPackage } from "@hypit/hypit/admission";
import type { FragmentOperation } from "@hypit/hypit/author";
import type { ModuleManifest, TypeRef } from "@hypit/hypit/protocol";
import type { StructuredSurfaceHandler, SurfaceResolvedReference } from "@hypit/hypit/markup";
import { compositionTypes } from "@hypit/composition";
import { mediaTypes } from "@hypit/media";
import type { FontStackRef } from "@hypit/media";
import type { Timeline } from "@hypit/timeline";
import { timelineTypes } from "@hypit/timeline";
import { spatialTypes } from "@hypit/spatial";
import type { SpatialFrame } from "@hypit/spatial";
import { assertTemporalInstantFor, temporalTypes } from "@hypit/temporal";
import type { TemporalInstant, TemporalWindow } from "@hypit/temporal";
import { resolveTemporalInstantReference, resolveTemporalWindowReference, resolveTemporalContext,
  temporalContextAttributeVocabulary, temporalInstantAttributeNames, temporalInstantAttributeVocabulary,
  temporalWindowAttributeNames, temporalWindowAttributeVocabulary } from "@hypit/temporal/markup";
import { renderCountdown } from "./render.js";
import type { Card, CountdownOptions } from "./render.js";

const module = { name: "@viral-clone/countdown-scene", version: "1" } as const;
const types = Object.fromEntries(["Options", "Card", "Cards"].map(name => [name, { module, name }])) as Record<"Options" | "Card" | "Cards", TypeRef>;
const producers = Object.fromEntries(["empty", "append", "render"].map(name => [name, { module, name }])) as Record<"empty" | "append" | "render", { module: typeof module; name: string }>;
export const manifest: ModuleManifest = { format: "hypit.module@1", ...module,
  dependencies: [compositionTypes.visualTrack, mediaTypes.fontStack, timelineTypes.timeline, spatialTypes.frame, temporalTypes.instant].map(type => ({ module: type.module })),
  types: Object.values(types).map(type => ({ name: type.name })), capabilities: [], producers: [
    { name: "empty", inputs: [], outputs: [{ name: "cards", type: types.Cards }], needs: [] },
    { name: "append", inputs: [{ name: "cards", type: types.Cards }, { name: "card", type: types.Card },
      { name: "at", type: temporalTypes.instant }, { name: "timeline", type: timelineTypes.timeline }], outputs: [{ name: "cards", type: types.Cards }], needs: [] },
    { name: "render", inputs: [{ name: "cards", type: types.Cards }, { name: "options", type: types.Options },
      { name: "timeline", type: timelineTypes.timeline }, { name: "within", type: spatialTypes.frame },
      { name: "window", type: temporalTypes.window }, { name: "font", type: mediaTypes.fontStack }], outputs: [{ name: "visual", type: compositionTypes.visualTrack }], needs: [] },
  ],
};
const inline = <T>(record: { value: { kind: string; value?: unknown } } | undefined): T => {
  if (record?.value.kind !== "inline") throw new Error("Countdown inputs must be inline values.");
  return record.value.value as T;
};
const value = (data: unknown) => ({ kind: "inline" as const, value: canonicalize(data) });
const component: ProducerPackage & AdmissionPackage = { producers: [
  { producer: producers.empty, handler: () => ({ outputs: { cards: value([]) }, needs: {} }) },
  { producer: producers.append, handler: ({ inputs }) => {
    const card = inline<Omit<Card, "at">>(inputs.card), at = inline<TemporalInstant>(inputs.at);
    const cards = inline<Card[]>(inputs.cards);
    assertTemporalInstantFor(at, { subjectId: card.id, timeline: inline<Timeline>(inputs.timeline) });
    if (cards.some(item => item.id === card.id) || (cards.at(-1)?.at.frame ?? -1) >= at.frame) throw new Error("Countdown cards need unique ids and strictly increasing times.");
    return { outputs: { cards: value([...cards, { ...card, at }]) }, needs: {} };
  } },
  { producer: producers.render, handler: ({ inputs }) => ({ outputs: { visual: value(renderCountdown(inline<Timeline>(inputs.timeline),
    inline<SpatialFrame>(inputs.within), inline<TemporalWindow>(inputs.window), inline<FontStackRef>(inputs.font),
    inline<Card[]>(inputs.cards), inline<CountdownOptions>(inputs.options))) }, needs: {} }) },
] };

const CARD_FIELDS = ["rank", "eyebrow", "title", "body", "note", "footer"] as const;

export const decodeSurface: StructuredSurfaceHandler = ({ element, resolveReference }) => {
  assertAttributes(element, ["id", "timeline", "within", "font", "brand", "entrance-frames", ...temporalWindowAttributeNames]);
  const id = textAttribute(element, "id"), context = resolveTemporalContext({ element, resolveReference });
  const window = resolveTemporalWindowReference({ element, resolveReference });
  const reference = (name: string, type: TypeRef): SurfaceResolvedReference => {
    const raw = element.attributes[name];
    if (typeof raw !== "object" || raw.kind !== "reference") throw new Error(`${name} must be a reference.`);
    const found = resolveReference(raw.path);
    if (found === undefined || !sameType(found.type, type)) throw new Error(`${name} has the wrong Type.`);
    return found;
  };
  const options: CountdownOptions = { id, brand: textAttribute(element, "brand"), entranceFrames: Number(element.attributes["entrance-frames"] ?? "12") };
  const records = [{ id: `${id}.options`, type: types.Options, value: value(options), range: element.range }];
  const inputs = [{ name: "timeline", type: timelineTypes.timeline }, { name: "within", type: spatialTypes.frame },
    { name: "font", type: mediaTypes.fontStack }, { name: "window", type: temporalTypes.window }, { name: "options", type: types.Options }];
  const bindings: Record<string, SurfaceResolvedReference["ref"]> = { timeline: context.timeline.ref, within: reference("within", spatialTypes.frame).ref,
    font: reference("font", mediaTypes.fontStack).ref, window: window.ref, options: { kind: "record", id: `${id}.options` } };
  const input = (name: string) => ({ kind: "fragment-input" as const, name });
  const operation = (name: string) => ({ kind: "fragment-operation" as const, operation: name });
  const operations: FragmentOperation[] = [{ id: "empty", producer: producers.empty, inputs: {}, result: { kind: "output", name: "cards" } }];
  let previous = "empty", index = 0;
  for (const child of element.children) {
    if (child.kind === "text") { if (child.value.trim()) throw new Error("Countdown accepts Card children."); continue; }
    if (child.name.split(":").at(-1) !== "Card") throw new Error("Countdown accepts Card children.");
    assertAttributes(child, ["id", ...CARD_FIELDS, ...temporalInstantAttributeNames]); assertEmptyElement(child);
    const fields = Object.fromEntries(CARD_FIELDS.map(name => [name, child.attributes[name] === undefined ? "" : textAttribute(child, name)]));
    if (!fields.title) throw new Error("Countdown Card needs a title.");
    const at = resolveTemporalInstantReference({ element: child, resolveReference });
    const key = `card-${++index}`;
    records.push({ id: `${id}.${key}`, type: types.Card, value: value({ id: textAttribute(child, "id"), ...fields }), range: child.range });
    inputs.push({ name: key, type: types.Card }, { name: `${key}-at`, type: temporalTypes.instant });
    bindings[key] = { kind: "record", id: `${id}.${key}` }; bindings[`${key}-at`] = at.ref;
    operations.push({ id: key, producer: producers.append, inputs: { cards: operation(previous), card: input(key), at: input(`${key}-at`), timeline: input("timeline") }, result: { kind: "output", name: "cards" } });
    previous = key;
  }
  if (!index) throw new Error("Countdown requires a Card.");
  operations.push({ id: "render", producer: producers.render, inputs: { cards: operation(previous), options: input("options"),
    timeline: input("timeline"), within: input("within"), font: input("font"), window: input("window") }, result: { kind: "output", name: "visual" } });
  const fragment = sealGraphFragment({ inputs, operations, exports: [{ name: "visual", type: compositionTypes.visualTrack, root: operation("render") }] });
  return { records, fragments: [fragment], components:
    [{ id, fragment: fragment.id, inputs: bindings, outputs: { visual: `${id}.visual` }, range: element.range }], exports: [`${id}.visual`] };
};
const declaration = { name: "countdown", tag: "Countdown", mode: "structured" as const,
  outputs: [compositionTypes.visualTrack, ...Object.values(types)],
  vocabulary: { summary: "A full-screen ranked countdown whose cards replace each other on authored Instants.", attributes: [
    ...temporalContextAttributeVocabulary, ...temporalWindowAttributeVocabulary,
    ...["id", "brand", "within", "font"].map(name => ({ name, kind: "expression" as const, required: true, summary: name })),
    { name: "entrance-frames", kind: "literal" as const, required: false, summary: "Entrance animation length; defaults to 12 frames." },
  ], children: [{ tag: "Card", cardinality: "many" as const, summary: "One card (intro, ranked entry or outro) and the Instant that reveals it.", attributes: [
    { name: "id", kind: "literal" as const, required: true, summary: "id" },
    { name: "title", kind: "literal" as const, required: true, summary: "Headline" },
    ...["rank", "eyebrow", "body", "note", "footer"].map(name => ({ name, kind: "literal" as const, required: false, summary: name })),
    ...temporalInstantAttributeVocabulary,
  ] }], ports: [{ name: "visual", type: compositionTypes.visualTrack, summary: "The complete countdown scene." }],
    example: '<countdown:Countdown id="c" timeline={t.timeline} within={canvas.bounds} font={font} during={t.window} brand="MY CHANNEL"><countdown:Card id="one" rank="#1" title="Title" at={t.one}/></countdown:Countdown>',
  },
};
export const hypitPackage = { format: "hypit.package@1" as const, modules: [{ manifest }],
  facets: [createProducerPackageFacet(component), createAdmissionPackageFacet(component),
    createMarkupSurfaceFacet({ module, declaration, handler: decodeSurface })] };
export default hypitPackage;
