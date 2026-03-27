"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export function FormsFieldComplete() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Complete Form</CardTitle>
        <CardDescription>
          A full form combining multiple field types and states.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 @3xl:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="complete-first">First name</Label>
            <Input id="complete-first" placeholder="John" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="complete-last">Last name</Label>
            <Input id="complete-last" placeholder="Doe" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="complete-email">Email</Label>
          <Input
            id="complete-email"
            type="email"
            placeholder="john@example.com"
          />
          <p className="text-muted-foreground text-sm">
            Your primary contact email.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="complete-role">Role</Label>
          <Select>
            <SelectTrigger id="complete-role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="complete-bio">Bio</Label>
          <Textarea id="complete-bio" placeholder="Tell us about yourself..." />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="complete-terms" />
            <Label htmlFor="complete-terms" className="font-normal">
              I agree to the terms and conditions
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="complete-newsletter" className="font-normal">
              Subscribe to newsletter
            </Label>
            <Switch id="complete-newsletter" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}
