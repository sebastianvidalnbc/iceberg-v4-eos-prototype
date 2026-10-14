// Shared layout identity — the single source for how a layout TYPE looks in the
// authoring UI. The Layout Picker (catalog rows) and the Structure Explorer
// (top-level section regions) both read from here, so a layout is recognised
// by the same colour and icon in both places.
//
// Colour belongs to the layout TYPE, not the instance: every Plan Picker is
// the same amber, every Footer the same purple. The accent hex values live in
// layout-identity.css (one `data-layout-type` rule per type).
import { LAYOUT_CATALOG, type LayoutDef, type LayoutGroup } from "./layouts";
import type { StructureNode } from "./data";
import "./layout-identity.css";

export type LayoutTypeId =
  | "hero"
  | "plan-picker"
  | "content"
  | "media"
  | "commerce"
  | "footer"
  | "structure";

export interface LayoutTypeIdentity {
  id: LayoutTypeId;
  name: string;
  // Material Symbols ligature — the same glyph in the picker and the tree.
  icon: string;
}

export const LAYOUT_TYPES: Record<LayoutTypeId, LayoutTypeIdentity> = {
  hero: { id: "hero", name: "Hero", icon: "image" },
  "plan-picker": { id: "plan-picker", name: "Plan Picker", icon: "grid_view" },
  content: { id: "content", name: "Content", icon: "article" },
  media: { id: "media", name: "Media & Grids", icon: "perm_media" },
  commerce: { id: "commerce", name: "Commerce", icon: "shopping_bag" },
  footer: { id: "footer", name: "Footer", icon: "dock_to_bottom" },
  structure: { id: "structure", name: "Structure & Logic", icon: "account_tree" },
};

// Catalog group → layout type. Two layouts break out of their group by id:
// Hero (filed under Content) and SEO Footer (filed under Structure).
const GROUP_TYPE: Record<LayoutGroup, LayoutTypeId> = {
  "Plan Pickers": "plan-picker",
  Content: "content",
  "Media & Grids": "media",
  Commerce: "commerce",
  Structure: "structure",
  "Logic & Targeting": "structure",
};

// The wash a layout type paints its region with. Must match `.layout-region`
// in layout-identity.css so boundary lines meet the region colour exactly.
export function layoutWash(t: LayoutTypeId): string {
  return `color-mix(in srgb, var(--layout-${t}) 7%, var(--color-bg-panel))`;
}

export function layoutTypeOf(def: LayoutDef): LayoutTypeId {
  if (def.id === "hero") return "hero";
  if (def.id === "seo-footer") return "footer";
  return GROUP_TYPE[def.group];
}

// Seeded sections carry a `role` instead of a catalog schemaId. These are the
// three roles the sample Variants use.
const ROLE_TYPE: Record<string, LayoutTypeId> = {
  "Page Title": "hero",
  "Plan Picker": "plan-picker",
  Footer: "footer",
};

// Which layout type a Structure node belongs to. Only top-level page sections
// resolve to a type; everything else (widgets, route rows, untyped sample
// sections) returns undefined and renders with no region identity.
export function layoutTypeForNode(node: StructureNode): LayoutTypeId | undefined {
  if (node.objectType !== "page-section") return undefined;
  if (node.schemaId) {
    const def = LAYOUT_CATALOG.find((l) => l.schemaId === node.schemaId);
    if (def) return layoutTypeOf(def);
  }
  if (node.role) {
    const def = LAYOUT_CATALOG.find((l) => l.name === node.role);
    if (def) return layoutTypeOf(def);
    return ROLE_TYPE[node.role];
  }
  return undefined;
}
