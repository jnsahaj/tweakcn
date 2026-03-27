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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

function FieldDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Default</CardTitle>
        <CardDescription>Form fields in their default state.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="default-input">Email</Label>
          <Input id="default-input" placeholder="you@example.com" />
          <p className="text-muted-foreground text-sm">
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

function FieldInvalid() {
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
          />
          <p className="text-destructive text-sm">
            Please enter a valid email address.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="invalid-textarea">Bio</Label>
          <Textarea
            id="invalid-textarea"
            defaultValue="Hi"
            aria-invalid="true"
          />
          <p className="text-destructive text-sm">
            Bio must be at least 10 characters.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="invalid-select">Country</Label>
          <Select>
            <SelectTrigger
              id="invalid-select"
              aria-invalid="true"
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
          <p className="text-destructive text-sm">
            Please select a country.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function FieldDisabled() {
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

function FieldWithControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Controls</CardTitle>
        <CardDescription>
          Checkboxes, radio buttons, and switches.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium">Notifications</legend>
          <div className="flex items-center gap-2">
            <Checkbox id="ctrl-email" defaultChecked />
            <Label htmlFor="ctrl-email" className="font-normal">
              Email notifications
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="ctrl-sms" />
            <Label htmlFor="ctrl-sms" className="font-normal">
              SMS notifications
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="ctrl-push" disabled />
            <Label htmlFor="ctrl-push" className="font-normal">
              Push notifications (coming soon)
            </Label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium">Frequency</legend>
          <RadioGroup defaultValue="daily">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="realtime" id="freq-realtime" />
              <Label htmlFor="freq-realtime" className="font-normal">
                Real-time
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="daily" id="freq-daily" />
              <Label htmlFor="freq-daily" className="font-normal">
                Daily digest
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="weekly" id="freq-weekly" />
              <Label htmlFor="freq-weekly" className="font-normal">
                Weekly summary
              </Label>
            </div>
          </RadioGroup>
        </fieldset>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="switch-dark" className="font-normal">
              Dark mode
            </Label>
            <Switch id="switch-dark" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="switch-marketing" className="font-normal">
              Marketing emails
            </Label>
            <Switch id="switch-marketing" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FieldLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Loading</CardTitle>
        <CardDescription>
          Form submission in progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="loading-input">Email</Label>
          <Input
            id="loading-input"
            defaultValue="user@example.com"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="loading-textarea">Feedback</Label>
          <Textarea
            id="loading-textarea"
            defaultValue="Great product!"
            disabled
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled className="w-full">
          <Loader2 className="animate-spin" />
          Submitting...
        </Button>
      </CardFooter>
    </Card>
  );
}

function FieldComplete() {
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

export default function FormsDemo() {
  return (
    <div className="@container grid gap-4 p-2 md:p-4 md:pt-1 @3xl:grid-cols-2 @5xl:grid-cols-3">
      <FieldDefault />
      <FieldInvalid />
      <FieldDisabled />
      <FieldWithControls />
      <FieldLoading />
      <FieldComplete />
    </div>
  );
}
