import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Activity, Category, ActivityType, Difficulty } from "@/lib/activities";

const BLANK: Omit<Activity, "id"> = {
  slug: "",
  category: "water",
  title: "",
  shortDescription: "",
  longDescription: "",
  image: "",
  images: [],
  durationMinutes: 60,
  durationLabel: "",
  types: [],
  options: [{ label: "", price: null }],
  active: true,
  meetingPoint: "",
  departureLocation: "",
  difficulty: "Easy",
  languages: ["FR", "EN"],
  minAge: 0,
  included: [""],
  excluded: [""],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ActivityModalProps {
  open: boolean;
  editing: Activity | null;
  onClose: () => void;
  onSave: (a: Activity) => void;
}

export function ActivityModal({ open, editing, onClose, onSave }: ActivityModalProps) {
  const [form, setForm] = useState<Omit<Activity, "id"> & { id: string }>(
    editing ? { ...editing } : { id: crypto.randomUUID().slice(0, 8), ...BLANK },
  );
  const [priceOnRequest, setPriceOnRequest] = useState(
    editing ? editing.options.every((o) => o.price === null) : true,
  );

  useEffect(() => {
    if (editing) {
      setForm({ ...editing });
      setPriceOnRequest(editing.options.every((o) => o.price === null));
    } else {
      setForm({ id: crypto.randomUUID().slice(0, 8), ...BLANK });
      setPriceOnRequest(true);
    }
  }, [editing, open]);

  if (!open) return null;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!editing) set("slug", slugify(v) + "-djerba");
  };

  const handleSave = () => {
    const a: Activity = {
      ...form,
      options: priceOnRequest
        ? [{ label: form.durationLabel || "Standard", price: null }]
        : form.options.filter((o) => o.label),
      included: form.included.filter(Boolean),
      excluded: form.excluded.filter(Boolean),
    };
    onSave(a);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-bold">
            {editing ? "Edit Activity" : "Add New Activity"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Jet Ski Safari"
              className="h-11"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Slug (URL)
            </label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="jet-ski-safari-djerba"
              className="h-11 font-mono text-sm"
            />
          </div>

          {/* Category / Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v as Category)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="excursions">Excursions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Duration label
              </label>
              <Input
                value={form.durationLabel}
                onChange={(e) => set("durationLabel", e.target.value)}
                placeholder="e.g. 1 h 30"
                className="h-11"
              />
            </div>
          </div>

          {/* Short description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Short description
            </label>
            <Input
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="One-line tagline"
              className="h-11"
            />
          </div>

          {/* Long description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Full description
            </label>
            <textarea
              value={form.longDescription}
              onChange={(e) => set("longDescription", e.target.value)}
              rows={4}
              placeholder="Detailed activity description…"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-3 rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pricing
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Price on Request</span>
                <Switch
                  checked={priceOnRequest}
                  onCheckedChange={setPriceOnRequest}
                  id="price-on-request"
                />
              </div>
            </div>
            {!priceOnRequest && (
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={opt.label}
                      onChange={(e) =>
                        set(
                          "options",
                          form.options.map((o, j) => (j === i ? { ...o, label: e.target.value } : o)),
                        )
                      }
                      placeholder="Label (e.g. 30 min)"
                      className="h-10 flex-1"
                    />
                    <Input
                      type="number"
                      value={opt.price ?? ""}
                      onChange={(e) =>
                        set(
                          "options",
                          form.options.map((o, j) =>
                            j === i ? { ...o, price: e.target.value ? Number(e.target.value) : null } : o,
                          ),
                        )
                      }
                      placeholder="€"
                      className="h-10 w-24"
                    />
                    <button
                      onClick={() =>
                        set(
                          "options",
                          form.options.filter((_, j) => j !== i),
                        )
                      }
                      className="h-10 w-10 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                  onClick={() => set("options", [...form.options, { label: "", price: null }])}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add option
                </Button>
              </div>
            )}
          </div>

          {/* Included */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ✓ Included
            </label>
            {form.included.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    set(
                      "included",
                      form.included.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder="e.g. Life jacket"
                  className="h-10"
                />
                <button
                  onClick={() =>
                    set(
                      "included",
                      form.included.filter((_, j) => j !== i),
                    )
                  }
                  className="h-10 w-10 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl"
              onClick={() => set("included", [...form.included, ""])}
            >
              <Plus className="h-4 w-4 mr-1" /> Add item
            </Button>
          </div>

          {/* Excluded */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ✗ Not included
            </label>
            {form.excluded.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    set(
                      "excluded",
                      form.excluded.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder="e.g. Hotel pickup"
                  className="h-10"
                />
                <button
                  onClick={() =>
                    set(
                      "excluded",
                      form.excluded.filter((_, j) => j !== i),
                    )
                  }
                  className="h-10 w-10 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl"
              onClick={() => set("excluded", [...form.excluded, ""])}
            >
              <Plus className="h-4 w-4 mr-1" /> Add item
            </Button>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Image URL
            </label>
            <Input
              value={form.image as string}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-11"
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-semibold">Active / Published</p>
              <p className="text-xs text-muted-foreground">
                Hidden activities won't appear on public pages.
              </p>
            </div>
            <Switch
              id="activity-active"
              checked={form.active}
              onCheckedChange={(v) => set("active", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.title || !form.slug}
            className="rounded-full bg-primary text-primary-foreground"
          >
            {editing ? "Save changes" : "Create activity"}
          </Button>
        </div>
      </div>
    </div>
  );
}
