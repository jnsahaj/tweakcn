import { SectionHeading } from "@/components/examples/marketing/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "5 Ways AI Helps Teams Stay in Flow",
    body: "Discover simple ways to cut distractions and keep your team focused on meaningful work.",
    category: "Productivity",
    readTime: "8 min read",
    date: "4 Sept, 2025",
    authorName: "Sophie Tan",
    authorAvatar: "/examples/avatars/person-1.webp",
    image: "/examples/marketing/blog-1.webp",
  },
  {
    title: "The End of Context Switching",
    body: "How AI keeps your focus where it matters and removes the friction between your tools.",
    category: "Workflow",
    readTime: "7 min read",
    date: "4 Sept, 2025",
    authorName: "Hanna Lee",
    authorAvatar: "/examples/avatars/person-6.webp",
    image: "/examples/marketing/blog-2.webp",
  },
  {
    title: "Why Small Teams Win Big with AI",
    body: "Lean setups, smarter workflows, and faster delivery for teams that punch above their weight.",
    category: "Startups",
    readTime: "3 min read",
    date: "4 Sept, 2025",
    authorName: "Alex Morgan",
    authorAvatar: "/examples/avatars/person-2.webp",
    image: "/examples/marketing/blog-3.webp",
  },
];

export function Insights() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 lg:gap-16 lg:px-8">
        <div className="flex gap-5 lg:gap-9">
          <SectionHeading
            align="left"
            tagline="Blog"
            title="Acme Inc. Insights"
            body="Insights, tips, and stories to help you work smarter and finish faster."
            className="flex-1"
          />

          <Button variant="secondary" className="ml-auto hidden self-end lg:flex">
            See all
          </Button>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-9">
          {posts.map((post) => (
            <InsightCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  title,
  body,
  category,
  readTime,
  date,
  authorName,
  authorAvatar,
  image,
}: (typeof posts)[number]) {
  const initials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="group/insight-card flex flex-col">
      <div className="bg-muted relative aspect-3/2 w-full overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="size-full object-cover transition group-hover/insight-card:opacity-90"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-primary text-sm font-medium">{category}</span>
          <span className="text-muted-foreground text-sm">{readTime}</span>
        </div>

        <div className="grid gap-1">
          <h3 className="text-lg font-medium tracking-tight text-balance">{title}</h3>
          <p className="text-muted-foreground line-clamp-3 text-sm text-pretty">{body}</p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Avatar>
            <AvatarImage src={authorAvatar} alt={authorName} className="object-cover" />
            <AvatarFallback className="uppercase">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{authorName}</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
