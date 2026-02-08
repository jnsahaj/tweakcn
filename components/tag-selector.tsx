"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COMMUNITY_THEME_TAGS, MAX_TAGS_PER_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  disabled,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = (tag: string) => {
    setSearch("");
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < MAX_TAGS_PER_THEME) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemove = (tag: string) => {
    if (disabled) return;
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Tags{" "}
          <span className="text-muted-foreground font-normal">
            ({selectedTags.length}/{MAX_TAGS_PER_THEME})
          </span>
        </p>
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                onClick={() => handleRemove(tag)}
                disabled={disabled}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="text-muted-foreground">
              {selectedTags.length >= MAX_TAGS_PER_THEME
                ? "Max tags selected"
                : "Search tags..."}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={true}>
            <CommandInput
              placeholder="Search tags..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList
              className="max-h-[200px]"
              onWheelCapture={(e) => e.stopPropagation()}
            >
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {COMMUNITY_THEME_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isAtLimit =
                    !isSelected &&
                    selectedTags.length >= MAX_TAGS_PER_THEME;
                  return (
                    <CommandItem
                      key={tag}
                      value={tag}
                      disabled={isAtLimit}
                      onSelect={() => handleSelect(tag)}
                      className={cn(isAtLimit && "opacity-50")}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
