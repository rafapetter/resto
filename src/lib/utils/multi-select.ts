export type MultiSelectValue = {
  selected: string[];
  custom: string;
};

export const EMPTY_MULTI_SELECT: MultiSelectValue = {
  selected: [],
  custom: "",
};

/** Check if a MultiSelectValue has any content */
export function hasMultiSelectContent(v: MultiSelectValue): boolean {
  return v.selected.length > 0 || v.custom.trim().length > 0;
}

/** Resolve a MultiSelectValue into a human-readable string */
export function resolveMultiSelect(
  v: MultiSelectValue,
  optionMap: Record<string, string>,
): string {
  const parts: string[] = [];
  for (const id of v.selected) {
    parts.push(optionMap[id] ?? id);
  }
  if (v.custom.trim()) parts.push(v.custom.trim());
  return parts.join(", ");
}
