# Figma → React component map (V4)

Check this before any Figma MCP call. **Verified** rows have specs in
`docs/eos-design-system.md` §7, so use them and don't re-inspect.

**Status key:** **Verified + implemented** = specs read via MCP and shipped ·
**Verified** = specs read, not (fully) built · **Known node** = ID from file
metadata, never inspected · **Doc-referenced** = cited in existing docs, not
re-checked this session.

## Figma files

| File | Key | Entry | Use |
|---|---|---|---|
| Eos – Library v1.0 | `N8BwUZPaO2artCvrsarVK2` | `554:5314` | Primary Eos library (tokens, OpsHub bar, tables) |
| Eos – Workset | `YgLwZNnExyyvfUVcyyelzh` | page `76:2` "02 Components / Content & navigation" | List family, card, accordion, HITL patterns |

URL: `https://www.figma.com/design/<key>/…?node-id=<id with - instead of :>`.

## Eos – Workset (`YgLwZNnExyyvfUVcyyelzh`)

| Figma component | Node(s) | React | File | Status |
|---|---|---|---|---|
| List item (set) | `117:424` · One: Default `117:186`, Hover `117:201`, Focus `117:216`, Selected `117:231`, Disabled `117:247` · Two: Default `117:262` · Three: Default `117:343` | `ListItem` | `src/v4-eos/ui/property.tsx` | Verified + implemented (Default, Hover, Selected, Disabled; focus as inset ring) |
| List accessory (set) | `116:201` · Icon `116:172`, Avatar `116:179`, Image `116:182`, Checkbox `116:189`, Radio `116:192`, Switch `116:195`, Label `116:199` | `ListAccessory` (`icon` / `switch` / `label` widths) | `ui/property.tsx` | Verified + implemented for Icon-width, Switch, Label; Avatar/Image not built |
| List subheader (set) | `117:6210` · Full/Off `117:6202`, Full/On `117:6204`, Content/Off `117:6206`, Content/On `117:6208` | `PropertySection` (header) | `ui/property.tsx` | Verified + implemented (Full/Off + chevron) |
| List divider (set) | `117:6194` · Full `117:6190`, Content `117:6192` | `ListDivider`; also `divide-y` in `FieldsBody` | `ui/property.tsx`, `regions/Properties.tsx` | Verified + implemented |
| List (patterns) | `118:534` · Basic `118:291`, Divided `118:328`, Grouped `118:369`, Nested `118:410`, Selection `118:460`, Switches `118:497` | `PropertyRows`; `CollectionBody` list | `ui/property.tsx`, `regions/Properties.tsx` | Verified + implemented (Basic, Selection, Switches, Grouped) |
| Switch | `72:168` (instance `72:144`) | `Switch size="lg"` via `SwitchField` | `ui/switch.tsx`, `ui/form-controls.tsx` | Verified (Off); On from screenshot |
| Checkbox | `72:122` | `CheckboxField` (shadcn) | `ui/checkbox.tsx`, `ui/form-controls.tsx` | Known node, **not verified** |
| Avatar | `72:37` (24/32/40) | — | — | Known node, not built |
| Icon wrapper | `28:67` (16 Muted `28:12`, 24 Muted `28:57`, 12 On Brand `52:258`) | `MSym`, `Icon` | `ui/msym.tsx`, `ui-lib/Icon.tsx` | Known node; V4 uses Material Symbols |
| Card | `76:133` (Stacked/Horizontal × Default/Hover/Selected/Disabled) | — | — | Known node, not inspected |
| Accordion | `76:170` (Collapsed/Expanded × Default/Error) | — (`Collapsible` used instead) | `ui/collapsible.tsx` | Known node, not inspected |
| HITL Review queue item / queue | `122:6362` / `122:6595` | — | — | Known node; out of scope (don't build HITL unasked) |

## Eos – Library v1.0 (`N8BwUZPaO2artCvrsarVK2`)

| Figma component | Node | React | File | Status |
|---|---|---|---|---|
| Library entry | `554:5314` | — | — | Doc-referenced |
| OpsHub bar | `449:14633` (Dock/Overlay × env) | `TopBar`, `OpsHubLogo` | `regions/TopBar.tsx`, `ui-lib/OpsHubLogo.tsx` | Doc-referenced; implemented in earlier commits |
| OpsHub env chip wordmark | `449:15743` | env chip | `ui-lib/tokens.css` (`--type-label-env-size`) | Doc-referenced |
| Table / selection rows | `488:8901` | browse tables, `TableFooter`, `FilterChip` | `views/*View.tsx`, `ui-lib/` | Doc-referenced |

## V4 pieces with no Figma counterpart recorded

`ObjectHeader`, `PropertyRow` (field row), `PanelHeader`, `TreeRow`
(Structure/outline rows: Inter 14 regular label), the resizer grabber and the
template gallery are Iceberg compositions. `docs/eos-adoption.md` §8 lists them
as candidate Eos contributions.

## Adding to this map

After any new Figma inspection: add the node IDs here and the measured values to
`docs/eos-design-system.md` §7, marked Verified, with the date.
