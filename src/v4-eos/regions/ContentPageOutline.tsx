import { useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { Panel } from "@/v4-eos/ui/panel";
import { ScrollArea } from "@/v4-eos/ui/scroll-area";
import { MSym } from "@/v4-eos/ui/msym";
import {
  CONTENT_PAGE_OUTLINE,
  CONTENT_PAGE_OUTLINE_DEFAULT_OPEN,
  type OutlineGroupId,
  type OutlineNode,
} from "../contentPages";
import "./content-page-outline.css";

const TREE_ITEM = '[role="treeitem"]';

// Ids of every node currently rendered. Collapsed groups don't render children,
// so this is also the keyboard traversal set.
function visibleIds(
  nodes: OutlineNode[],
  open: Set<string>,
  out = new Set<string>(),
): Set<string> {
  for (const n of nodes) {
    out.add(n.id);
    if (n.children && open.has(n.id)) visibleIds(n.children, open, out);
  }
  return out;
}

export function ContentPageOutline({
  selected,
  onSelect,
}: {
  selected: OutlineGroupId;
  onSelect: (id: OutlineGroupId) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(() =>
    new Set(CONTENT_PAGE_OUTLINE_DEFAULT_OPEN),
  );
  // Roving tabindex: the last-focused item is the single Tab stop.
  const [focusId, setFocusId] = useState<string | null>(null);
  const treeRef = useRef<HTMLUListElement>(null);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visible = visibleIds(CONTENT_PAGE_OUTLINE, open);
  const tabStop =
    [focusId, selected].find((id) => id !== null && visible.has(id)) ??
    CONTENT_PAGE_OUTLINE[0].id;

  // Keyboard model follows the WAI-ARIA tree pattern. Enter/Space select a
  // selectable item or toggle an expandable-only group (which never changes the
  // selection).
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>(TREE_ITEM);
    const tree = treeRef.current;
    if (!item || !tree) return;
    const all = Array.from(tree.querySelectorAll<HTMLElement>(TREE_ITEM));
    const index = all.indexOf(item);
    const id = item.dataset.nodeId ?? "";
    const selectable = item.dataset.selectable === "true";
    const expandable = item.hasAttribute("aria-expanded");
    const expanded = item.getAttribute("aria-expanded") === "true";
    const go = (el: HTMLElement | null | undefined) => {
      e.preventDefault();
      el?.focus();
    };

    switch (e.key) {
      case "ArrowDown":
        go(all[index + 1]);
        break;
      case "ArrowUp":
        go(all[index - 1]);
        break;
      case "Home":
        go(all[0]);
        break;
      case "End":
        go(all[all.length - 1]);
        break;
      case "ArrowRight":
        if (!expandable) return;
        if (expanded) go(item.querySelector<HTMLElement>(TREE_ITEM));
        else {
          e.preventDefault();
          toggle(id);
        }
        break;
      case "ArrowLeft":
        if (expandable && expanded) {
          e.preventDefault();
          toggle(id);
        } else {
          go(item.parentElement?.closest<HTMLElement>(TREE_ITEM));
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (selectable) onSelect(id as OutlineGroupId);
        else toggle(id);
        break;
    }
  };

  const onFocus = (e: FocusEvent<HTMLUListElement>) => {
    const id = (e.target as HTMLElement).closest<HTMLElement>(TREE_ITEM)?.dataset.nodeId;
    if (id) setFocusId(id);
  };

  const renderNodes = (nodes: OutlineNode[], depth: number): ReactNode =>
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isOpen = open.has(node.id);
      const selectable = node.selectable !== false;
      const labelId = `cp-outline-label-${node.id}`;
      return (
        <li
          key={node.id}
          role="treeitem"
          aria-level={depth + 1}
          aria-labelledby={labelId}
          aria-selected={selectable ? selected === node.id : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          tabIndex={node.id === tabStop ? 0 : -1}
          data-node-id={node.id}
          data-selectable={selectable}
          className="cp-tree-item"
        >
          <div
            className="cp-tree-item__content"
            onClick={() => (selectable ? onSelect(node.id) : toggle(node.id))}
          >
            {depth === 0 && node.icon && (
              <span aria-hidden className="cp-tree-item__icon">
                <MSym name={node.icon} size={16} />
              </span>
            )}
            <span id={labelId} className="cp-tree-item__label">
              {node.label}
            </span>
            {hasChildren && (
              <span aria-hidden className="cp-tree-item__trailing">
                <MSym name="chevron_right" size={16} />
              </span>
            )}
          </div>
          {hasChildren && isOpen && (
            <ul role="group" className="cp-tree-item__group-transition">
              {renderNodes(node.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <Panel
      className="ui-ws__region ui-ws-explorer ui-ws-explorer--content-outline bg-[var(--color-bg-surface)]"
      aria-label="Template"
    >
      <ScrollArea className="min-h-0 flex-1 basis-0">
        <ul
          ref={treeRef}
          role="tree"
          aria-label="Template outline"
          className="cp-tree"
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        >
          {renderNodes(CONTENT_PAGE_OUTLINE, 0)}
        </ul>
      </ScrollArea>
    </Panel>
  );
}
