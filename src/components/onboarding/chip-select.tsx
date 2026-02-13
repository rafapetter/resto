"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MultiSelectValue } from "@/lib/utils/multi-select";

// Re-export shared types/helpers so existing client imports keep working
export {
  type MultiSelectValue,
  EMPTY_MULTI_SELECT,
  hasMultiSelectContent,
  resolveMultiSelect,
} from "@/lib/utils/multi-select";

export type ChipOption = {
  id: string;
  label: string;
};

type Props = {
  options: ChipOption[];
  value: MultiSelectValue;
  onChange: (value: MultiSelectValue) => void;
  placeholder?: string;
  /** Use textarea (multi-line) instead of input for the custom field */
  multiline?: boolean;
};

export function ChipSelect({
  options,
  value,
  onChange,
  placeholder,
  multiline,
}: Props) {
  function toggleOption(id: string) {
    const next = value.selected.includes(id)
      ? value.selected.filter((s) => s !== id)
      : [...value.selected, id];
    onChange({ ...value, selected: next });
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value.selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {multiline ? (
        <Textarea
          placeholder={placeholder ?? "Add your own..."}
          value={value.custom}
          onChange={(e) => onChange({ ...value, custom: e.target.value })}
          rows={2}
        />
      ) : (
        <Input
          placeholder={placeholder ?? "Add your own..."}
          value={value.custom}
          onChange={(e) => onChange({ ...value, custom: e.target.value })}
        />
      )}
    </div>
  );
}
