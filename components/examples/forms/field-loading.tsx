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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function FormsFieldLoading() {
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
