"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { updateCommunityProfile } from "@/actions/community-profiles";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialLinks } from "@/db/schema";

const MAX_BIO_LENGTH = 180;

const formSchema = z.object({
  id: z.string(),
  display_name: z.string().min(1, "Display name cannot be empty"),
  bio: z.string().max(MAX_BIO_LENGTH, `Bio cannot exceed ${MAX_BIO_LENGTH} characters`).optional(),
  social_links: z.object({
    github: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
    twitter: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
    website: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm({ profile }: { profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: profile.id,
      display_name: profile.display_name || "",
      bio: profile.bio || "",
      social_links: {
        github: profile.social_links?.github || "",
        twitter: profile.social_links?.twitter || "",
        website: profile.social_links?.website || "",
      },
    },
  });

  const bioValue = form.watch("bio") || "";
  const remainingChars = MAX_BIO_LENGTH - bioValue.length;

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-semibold mb-4">Basic information</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.image || ""} alt={profile.display_name || "User"} />
            <AvatarFallback>{profile.display_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </div>

        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself" 
                  {...field} 
                  maxLength={MAX_BIO_LENGTH}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground mt-1">
                {remainingChars} characters remaining
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-xl font-semibold mb-4">Social links</h2>

        <FormField
          control={form.control}
          name="social_links.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <span className="text-muted-foreground">https://</span>
                </div>
                <FormControl>
                  <Input
                    className="rounded-l-none"
                    placeholder="yourwebsite.com"
                    {...field}
                    value={field.value?.replace(/^https?:\/\//, "") || ""}
                    onChange={(e) => field.onChange(e.target.value ? `https://${e.target.value.replace(/^https?:\/\//, "")}` : "")}
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
              <FormLabel>GitHub URL</FormLabel>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <span className="text-muted-foreground">https://</span>
                </div>
                <FormControl>
                  <Input
                    className="rounded-l-none"
                    placeholder="github.com/username"
                    {...field}
                    value={field.value?.replace(/^https?:\/\//, "") || ""}
                    onChange={(e) => field.onChange(e.target.value ? `https://${e.target.value.replace(/^https?:\/\//, "")}` : "")}
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
              <FormLabel>Twitter URL</FormLabel>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  <span className="text-muted-foreground">https://</span>
                </div>
                <FormControl>
                  <Input
                    className="rounded-l-none"
                    placeholder="twitter.com/username"
                    {...field}
                    value={field.value?.replace(/^https?:\/\//, "") || ""}
                    onChange={(e) => field.onChange(e.target.value ? `https://${e.target.value.replace(/^https?:\/\//, "")}` : "")}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
