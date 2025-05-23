"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { updateCommunityProfile } from "@/actions/community-profiles";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Camera, Globe, Loader2 } from "lucide-react";
import GithubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import { cn } from "@/lib/utils";

const MAX_BIO_LENGTH = 180;

const formSchema = z.object({
  id: z.string(),
  display_name: z.string().min(1, "Display name cannot be empty"),
  bio: z.string().max(MAX_BIO_LENGTH, `Bio cannot exceed ${MAX_BIO_LENGTH} characters`).nullable(),
  social_links: z.object({
    github: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    twitter: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm({
  profile,
}: {
  profile: {
    id: string;
    display_name: string;
    bio: string | null;
    image: string | null;
    social_links: {
      github?: string;
      twitter?: string;
      website?: string;
    } | null;
  };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: profile.id,
      display_name: profile.display_name,
      bio: profile.bio,
      social_links: {
        github: profile.social_links?.github || "",
        twitter: profile.social_links?.twitter || "",
        website: profile.social_links?.website || "",
      },
    },
  });

  const bioValue = form.watch("bio") ?? "";
  const remainingChars = MAX_BIO_LENGTH - bioValue.length;
  const bioPercentage = (bioValue.length / MAX_BIO_LENGTH) * 100;

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const result = await updateCommunityProfile(values);

      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAvatarClick = () => {
    // This would typically open a file picker
    throw new Error("Image Update not implemented");
  };

  return (
    <div className="animate-in fade-in-50 mx-auto w-full">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
              <Separator />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 md:gap-8">
                <div
                  className="group pointer-events-none relative cursor-not-allowed"
                  aria-disabled={true}
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                  onClick={handleAvatarClick}
                >
                  <Avatar className="border-primary/20 hover:border-primary/50 h-24 w-24 border-2 transition-all duration-300">
                    <AvatarImage
                      src={profile.image || ""}
                      alt={profile.display_name || "User"}
                      className={cn(
                        "transition-all duration-300"
                        // isHoveringAvatar ? "opacity-50" : "opacity-100"
                      )}
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.display_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-full bg-black/30 transition-opacity duration-300",
                      isHoveringAvatar ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </div> */}
                </div>

                <div className="w-full flex-1">
                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl className="mb-8">
                          <Input
                            placeholder="Your display name"
                            {...field}
                            className="focus:ring-primary/20 transition-all duration-200 focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself, your interests, and what you're working on"
                        {...field}
                        value={field.value ?? ""}
                        maxLength={MAX_BIO_LENGTH}
                        className="focus:ring-primary/20 min-h-[120px] resize-none transition-all duration-200 focus:ring-2"
                      />
                    </FormControl>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={bioPercentage} className="h-1 flex-1" />
                      <span className={cn("text-xs font-medium")}>
                        {remainingChars} characters remaining
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Social Links</h3>
              <Separator />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="social_links.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                    </FormLabel>
                    <div className="flex">
                      <div className="bg-muted border-input flex items-center rounded-l-md border border-r-0 px-3">
                        <span className="text-muted-foreground text-sm">https://</span>
                      </div>
                      <FormControl>
                        <Input
                          className="focus:ring-primary/20 rounded-l-none transition-all duration-200 focus:ring-2"
                          placeholder="yourwebsite.com"
                          {...field}
                          value={field.value?.replace(/^https?:\/\//, "") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? `https://${e.target.value.replace(/^https?:\/\//, "")}`
                                : ""
                            )
                          }
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_links.github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <GithubIcon className="h-4 w-4" />
                      <span>GitHub</span>
                    </FormLabel>
                    <div className="flex">
                      <div className="bg-muted border-input flex items-center rounded-l-md border border-r-0 px-3">
                        <span className="text-muted-foreground text-sm">https://</span>
                      </div>
                      <FormControl>
                        <Input
                          className="focus:ring-primary/20 rounded-l-none transition-all duration-200 focus:ring-2"
                          placeholder="github.com/username"
                          {...field}
                          value={field.value?.replace(/^https?:\/\//, "") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? `https://${e.target.value.replace(/^https?:\/\//, "")}`
                                : ""
                            )
                          }
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_links.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <TwitterIcon className="h-4 w-4" />
                      <span>Twitter</span>
                    </FormLabel>
                    <div className="flex">
                      <div className="bg-muted border-input flex items-center rounded-l-md border border-r-0 px-3">
                        <span className="text-muted-foreground text-sm">https://</span>
                      </div>
                      <FormControl>
                        <Input
                          className="focus:ring-primary/20 rounded-l-none transition-all duration-200 focus:ring-2"
                          placeholder="twitter.com/username"
                          {...field}
                          value={field.value?.replace(/^https?:\/\//, "") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? `https://${e.target.value.replace(/^https?:\/\//, "")}`
                                : ""
                            )
                          }
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px] transition-all duration-300 hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
