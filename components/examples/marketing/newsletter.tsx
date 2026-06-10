import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 px-5 md:flex-row lg:gap-16 lg:px-8">
        <SectionHeading
          align="left"
          title="Stay in the loop"
          body="Get insights, product updates, and productivity tips straight to your inbox."
        />

        {/* Newsletter form */}
        <div className="flex flex-col gap-2 md:self-end lg:gap-3">
          <form className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="email@example.com" className="w-full sm:w-fit" />
            <Button type="submit" className="w-full sm:w-fit" aria-label="Subscribe to newsletter">
              <MailIcon /> Subscribe
            </Button>
          </form>

          <span className="text-muted-foreground text-xs" role="note">
            We respect your privacy.
          </span>
        </div>
      </div>
    </section>
  );
}
