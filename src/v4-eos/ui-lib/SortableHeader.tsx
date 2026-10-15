// Shared sort plumbing for browse tables (Pages, Widgets). A column header is a
// plain text button; the active column shows ↑ (ascending) or ↓ (descending).

export type SortDir = "asc" | "desc";
export type SortState<K extends string> = { key: K; dir: SortDir };

// Clicking the active column flips its direction; clicking another column starts
// it ascending.
export function nextSort<K extends string>(prev: SortState<K>, key: K): SortState<K> {
  return prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" };
}

// Empty values (null, shown as "—") always sink to the bottom, whichever direction.
export function compareSortValues(
  a: string | number | null,
  b: string | number | null,
  dir: SortDir,
): number {
  if (a === null || b === null) return a === b ? 0 : a === null ? 1 : -1;
  const cmp = typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : (a as number) - (b as number);
  return dir === "asc" ? cmp : -cmp;
}

export function SortHeaderCell<K extends string>({
  sortKey,
  label,
  sort,
  onSort,
}: {
  sortKey: K;
  label: string;
  sort: SortState<K>;
  onSort: (key: K) => void;
}) {
  const active = sort.key === sortKey;
  return (
    <span
      role="columnheader"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        className={`ui-ws-browse__sort${active ? " is-active" : ""}`}
        onClick={() => onSort(sortKey)}
      >
        {label}
        <span className="ui-ws-browse__sort-arrow" aria-hidden="true">
          {active ? (sort.dir === "asc" ? "↑" : "↓") : ""}
        </span>
      </button>
    </span>
  );
}
