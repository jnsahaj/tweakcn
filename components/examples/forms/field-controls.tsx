"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export function FormsFieldControls() {
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
