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

export function FormsFieldDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Default</CardTitle>
        <CardDescription>Form fields in their default state.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="default-input">Email</Label>
          <Input id="default-input" placeholder="you@example.com" aria-describedby="default-input-help" />
          <p id="default-input-help" className="text-muted-foreground text-sm">
            We&apos;ll never share your email.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="default-textarea">Message</Label>
          <Textarea id="default-textarea" placeholder="Type your message..." />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="default-select">Role</Label>
          <Select>
            <SelectTrigger id="default-select" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
