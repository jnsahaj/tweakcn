"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { SubmitCommunityThemeFormControl } from "../hooks/use-submit-community-theme-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  themeName: z.string().min(1, "Theme name cannot be empty."),
});

interface SubmitCommunityThemeFormProps {
  control: SubmitCommunityThemeFormControl;
  initialThemeName?: string;
}

export function SubmitCommunityThemeForm({
  control,
  initialThemeName = "",
}: SubmitCommunityThemeFormProps) {
  const { isOpen, isLoading, actions } = control;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeName: initialThemeName,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ themeName: initialThemeName });
    }
  }, [isOpen, initialThemeName, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    actions.submit(values.themeName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={actions.close}>
      <DialogContent className="gap-6 overflow-hidden rounded-lg border p-0 pt-6 shadow-lg sm:max-w-[550px]">
        <DialogHeader className="px-6">
          <DialogTitle>Submit Theme to Community</DialogTitle>
          <DialogDescription>
            Your theme will be reviewed before being published to the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6">
            <FormField
              control={form.control}
              name="themeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter theme name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="bg-muted/30 border-t px-6 py-4">
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="ghost" onClick={actions.close} disabled={isLoading} size="sm">
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading || !form.formState.isValid || form.formState.isSubmitting}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
