"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function FormsFieldDisabled() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Disabled</CardTitle>
        <CardDescription>
          Fields that are not interactive.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-input">Username</Label>
          <Input
            id="disabled-input"
            defaultValue="johndoe"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-textarea">Notes</Label>
          <Textarea
            id="disabled-textarea"
            defaultValue="This field is read-only."
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-select">Plan</Label>
          <Select disabled>
            <SelectTrigger id="disabled-select" className="w-full">
              <SelectValue placeholder="Enterprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="disabled-checkbox" disabled />
          <Label htmlFor="disabled-checkbox" className="font-normal">
            Accept terms
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="disabled-switch" disabled />
          <Label htmlFor="disabled-switch" className="font-normal">
            Enable notifications
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
