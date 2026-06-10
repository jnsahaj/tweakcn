import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSignIcon,
  CodeXmlIcon,
  HandPlatterIcon,
  LockIcon,
  SparklesIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

const faqs: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: SparklesIcon,
    title: "What is Acme AI?",
    description:
      "Acme AI is a personal AI workspace that helps individuals and teams cut context switching, gain clarity, and complete projects faster.",
  },
  {
    icon: UserIcon,
    title: "Who is Acme AI for?",
    description:
      "It's built for creators, teams, and businesses of all sizes who want to streamline their workflow and make smarter decisions.",
  },
  {
    icon: CircleDollarSignIcon,
    title: "How much does it cost?",
    description:
      "We offer flexible one-time plans starting at 199 USD. See our pricing section for details.",
  },
  {
    icon: CodeXmlIcon,
    title: "Do I need technical skills to use Acme AI?",
    description:
      "Not at all. Acme AI is designed to work out of the box with minimal setup, and integrates with the tools you already use.",
  },
  {
    icon: HandPlatterIcon,
    title: "Can I try it before I buy?",
    description: "Yes — we offer a demo so you can see how Acme AI fits into your workflow.",
  },
  {
    icon: LockIcon,
    title: "How does Acme AI handle my data?",
    description:
      "Your privacy and security are our top priority. All data is encrypted and never shared with third parties.",
  },
];

const contactAvatars = [
  { src: "/examples/avatars/cartoon-2.webp", fallback: "01" },
  { src: "/examples/avatars/cartoon-3.webp", fallback: "02" },
  { src: "/examples/avatars/cartoon-4.webp", fallback: "03" },
];

export function FAQ() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <SectionHeading align="left" tagline="Support" title="Frequently Asked Questions" />

        {/* FAQs */}
        <div className="grid gap-y-12 md:grid-cols-2 md:gap-9 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.title} className="flex max-w-xl flex-col items-start gap-4 text-left">
              <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-lg border">
                <faq.icon className="text-primary size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-medium tracking-tight text-balance">{faq.title}</h3>
                <p className="text-muted-foreground text-base text-pretty">{faq.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact banner */}
        <div className="bg-background flex flex-col items-center gap-9 rounded-xl border px-5 py-9 lg:px-9">
          <div className="flex -space-x-2">
            {contactAvatars.map((avatar) => (
              <Avatar key={avatar.fallback} className="ring-background ring-2 grayscale">
                <AvatarImage src={avatar.src} className="object-cover" />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          <SectionHeading
            title="Want to know more?"
            body="Our team is here to help you get the answers you need."
            className="max-w-xl"
          />

          <Button className="max-sm:w-full">Get in touch</Button>
        </div>
      </div>
    </section>
  );
}
