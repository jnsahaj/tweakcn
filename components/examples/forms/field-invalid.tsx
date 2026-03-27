"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function FormsFieldInvalid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Invalid</CardTitle>
        <CardDescription>
          Fields showing validation error states.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="invalid-input">Email</Label>
          <Input
            id="invalid-input"
            defaultValue="not-an-email"
            aria-invalid="true"
            aria-describedby="invalid-input-error"
          />
          <p id="invalid-input-error" className="text-destructive text-sm">
            Please enter a valid email address.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="invalid-textarea">Bio</Label>
          <Textarea
            id="invalid-textarea"
            defaultValue="Hi"
            aria-invalid="true"
            aria-describedby="invalid-textarea-error"
          />
          <p id="invalid-textarea-error" className="text-destructive text-sm">
            Bio must be at least 10 characters.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="invalid-select">Country</Label>
          <Select>
            <SelectTrigger
              id="invalid-select"
              aria-invalid="true"
              aria-describedby="invalid-select-error"
              className="w-full"
            >
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="br">Brazil</SelectItem>
            </SelectContent>
          </Select>
          <p id="invalid-select-error" className="text-destructive text-sm">
            Please select a country.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
