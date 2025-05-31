import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bookmark, Calendar, Clock, Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

export function BlogPost() {
  return (
    <Card className="bg-background flex min-h-screen flex-col overflow-hidden">
      <div className="bg-card flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-red-500"></div>
            <div className="size-3 rounded-full bg-yellow-500"></div>
            <div className="size-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </div>
      <div className="@container container mx-auto max-w-4xl px-4 py-8">
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Technology</Badge>
              <Badge variant="outline">Web Development</Badge>
              <Badge variant="outline">React</Badge>
            </div>

            <h1 className="text-4xl leading-tight font-bold tracking-tight @md:text-5xl @lg:text-6xl">
              The Future of Web Development: Embracing Modern Technologies
            </h1>

            <p className="text-muted-foreground text-xl leading-relaxed">
              Discover how cutting-edge technologies are reshaping the landscape of web development,
              from AI-powered tools to revolutionary frameworks that are changing how we build for
              the web.
            </p>

            {/* Author and Meta */}
            <div className="flex flex-col justify-between gap-4 pt-4 @sm:flex-row @sm:items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Jane Doe</p>
                  <p className="text-muted-foreground text-sm">Senior Developer</p>
                </div>
              </div>

              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Dec 15, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
            </div>
          </header>

          <Separator />

          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Featured image"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-bold">The Evolution of Modern Frameworks</h2>

            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>

            <blockquote className="border-primary my-6 border-l-4 pl-6 text-lg italic">
              "The best way to predict the future is to create it. In web development, we're not
              just following trends—we're setting them."
            </blockquote>

            <h3 className="mt-6 mb-3 text-xl font-semibold">Key Technologies Shaping the Future</h3>

            <ul className="my-4 space-y-2">
              <li>Artificial Intelligence and Machine Learning integration</li>
              <li>Edge computing and serverless architectures</li>
              <li>Progressive Web Applications (PWAs)</li>
              <li>WebAssembly for high-performance applications</li>
              <li>Advanced CSS features and container queries</li>
            </ul>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </p>

            <div className="my-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="mb-2 font-semibold">💡 Pro Tip</h4>
                  <p className="text-muted-foreground text-sm">
                    Always stay updated with the latest web standards and best practices. The web
                    development landscape evolves rapidly, and continuous learning is key to staying
                    relevant.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="mt-8 mb-4 text-2xl font-bold">Looking Ahead</h2>

            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
              quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>

            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
              voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
              occaecati cupiditate non provident.
            </p>
          </div>

          <Separator />

          {/* Engagement Actions */}
          <div className="flex flex-col items-start justify-between gap-4 @sm:flex-row @sm:items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span>42</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>12</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              <span>Save for later</span>
            </Button>
          </div>

          {/* Author Bio */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 @sm:flex-row">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Author" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Jane Doe</h3>
                  <p className="text-muted-foreground mb-2">Senior Developer & Tech Writer</p>
                  <p className="text-sm">
                    Jane is a passionate developer with over 8 years of experience in web
                    development. She specializes in React, TypeScript, and modern web technologies.
                    When she's not coding, you can find her writing about the latest trends in tech.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="self-start">
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </Card>
  );
}
