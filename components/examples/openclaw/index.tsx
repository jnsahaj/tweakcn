import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  BarChart3,
  Bot,
  ChevronDown,
  Clock,
  FileText,
  Folder,
  Layers,
  ListTree,
  Monitor,
  Moon,
  Paperclip,
  PanelLeft,
  Plus,
  Radio,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Sun,
  Upload,
  Wrench,
} from "lucide-react";

function Lobster({ className }: { className?: string }) {
  return (
    <span
      className={
        "bg-primary text-primary-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md text-base " +
        (className ?? "")
      }
      aria-hidden
    >
      🦞
    </span>
  );
}

function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
        {label}
        <ChevronDown className="size-3" />
      </button>
      <div className="flex flex-col gap-0.5 px-2">{children}</div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors " +
        (active
          ? "bg-primary/10 text-primary border-primary/20 border"
          : "text-foreground/80 hover:bg-accent hover:text-foreground")
      }
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function FilterChip({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-card text-foreground hover:bg-accent inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm">
      {children}
      <ChevronDown className="text-muted-foreground size-3.5" />
    </button>
  );
}

function ActionIconButton({
  icon: Icon,
  tinted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tinted?: boolean;
}) {
  return (
    <button
      className={
        "inline-flex size-8 items-center justify-center rounded-md border transition-colors " +
        (tinted
          ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
          : "bg-card text-foreground hover:bg-accent")
      }
    >
      <Icon className="size-4" />
    </button>
  );
}

function ContextChip() {
  return (
    <button className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs">
      <ChevronDown className="size-3 -rotate-90" />
      Context
    </button>
  );
}

export default function OpenClawDemo() {
  return (
    <div className="bg-background text-foreground flex size-full overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-card flex w-64 shrink-0 flex-col border-r">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Lobster />
            <div className="leading-tight">
              <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Control
              </div>
              <div className="text-sm font-semibold">OpenClaw</div>
            </div>
          </div>
          <button className="hover:bg-accent text-muted-foreground inline-flex size-7 items-center justify-center rounded-md">
            <PanelLeft className="size-4" />
          </button>
        </div>

        <div className="px-3 pb-3">
          <Button
            className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary w-full justify-center border"
            variant="outline"
          >
            <Plus className="size-4" />
            New session
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto pb-3">
          <SidebarSection label="Chat">
            <NavItem icon={Sparkles} label="Chat" active />
          </SidebarSection>
          <SidebarSection label="Control">
            <NavItem icon={BarChart3} label="Overview" />
            <NavItem icon={Radio} label="Instances" />
            <NavItem icon={FileText} label="Sessions" />
            <NavItem icon={Activity} label="Usage" />
            <NavItem icon={Clock} label="Cron Jobs" />
          </SidebarSection>
          <SidebarSection label="Agent">
            <NavItem icon={Bot} label="Agents" />
            <NavItem icon={Layers} label="Skills" />
            <NavItem icon={ListTree} label="Nodes" />
            <NavItem icon={Sparkles} label="Dreaming" />
          </SidebarSection>
          <SidebarSection label="Settings">
            <NavItem icon={Settings} label="Settings" />
          </SidebarSection>
        </nav>

        <div className="flex flex-col gap-1.5 border-t px-3 py-3">
          <button className="text-foreground/80 hover:bg-accent flex items-center justify-between rounded-md px-2 py-1.5 text-sm">
            <span className="flex items-center gap-2">
              <Folder className="size-4" />
              Docs
            </span>
          </button>
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground tracking-wider uppercase">
                Version
              </span>
              <span className="text-foreground font-mono">v2026.5.18</span>
            </div>
            <span className="bg-chart-2 size-2 rounded-full" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
          <nav className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
            <span>OpenClaw</span>
            <span className="opacity-50">›</span>
            <span>main</span>
            <span className="opacity-50">›</span>
            <span className="text-primary font-medium">Chat</span>
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Input
                placeholder="Search"
                className="bg-card text-muted-foreground h-9 w-56 pr-12"
              />
              <kbd className="bg-muted text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </div>
            <div className="bg-card inline-flex items-center rounded-md border p-0.5">
              <button className="bg-primary/15 text-primary inline-flex size-7 items-center justify-center rounded-sm">
                <Monitor className="size-3.5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-sm">
                <Sun className="size-3.5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-sm">
                <Moon className="size-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-3">
          <FilterChip>main</FilterChip>
          <FilterChip>Default (claude-sonnet-4…)</FilterChip>
          <FilterChip>Inherited: Adaptive</FilterChip>
          <div className="mx-1 h-5 w-px bg-border" />
          <ActionIconButton icon={RefreshCw} />
          <ActionIconButton icon={ListTree} tinted />
          <ActionIconButton icon={Sparkles} tinted />
          <ActionIconButton icon={Wrench} tinted />
          <ActionIconButton icon={Layers} tinted />
          <ActionIconButton icon={Clock} tinted />
        </div>

        {/* Chat thread */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
          {/* Assistant header (collapsed context) */}
          <div className="flex items-center gap-2">
            <Lobster />
            <span className="text-sm font-medium">Assistant</span>
            <span className="text-muted-foreground text-xs">
              Mar 21, 2026, 12:50 AM
            </span>
            <ContextChip />
          </div>

          {/* User message */}
          <div className="flex items-start justify-end gap-2">
            <div className="flex flex-col items-end gap-1">
              <div className="bg-primary/10 text-foreground max-w-[60ch] rounded-lg px-3.5 py-2 text-sm">
                why can&apos;t you run commands. how to let you do that
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>openclaw-tui (gateway-client)</span>
                <span>Mar 21, 2026, 12:51 AM</span>
              </div>
            </div>
            <div className="bg-muted text-muted-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md">
              <Bot className="size-4" />
            </div>
          </div>

          {/* Assistant message */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="bg-card text-card-foreground max-w-[72ch] space-y-2.5 rounded-lg px-4 py-3 text-sm leading-relaxed">
                <p>
                  My tools in this session are filtered down to just messaging
                  and session management — no{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    exec
                  </code>{" "}
                  or file system access. It&apos;s an OpenClaw policy thing.
                </p>
                <p>
                  To fix it, check your OpenClaw config (likely{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    ~/.openclaw/config.yml
                  </code>{" "}
                  or similar) and look for a{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    tools
                  </code>{" "}
                  or{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    permissions
                  </code>{" "}
                  section. You&apos;d want to enable{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    exec
                  </code>{" "}
                  or{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    bash
                  </code>{" "}
                  for the main agent.
                </p>
                <p>
                  Or run{" "}
                  <code className="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs">
                    openclaw help
                  </code>{" "}
                  and look for anything about tool policies / permissions.
                  Paste the relevant section and I&apos;ll tell you exactly
                  what to change.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Lobster />
                <span className="text-sm font-medium">Assistant</span>
                <span className="text-muted-foreground text-xs">
                  Mar 21, 2026, 12:51 AM
                </span>
                <ContextChip />
              </div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="bg-card shrink-0 border-t p-3">
          <Textarea
            placeholder="Message Assistant (Enter to send)"
            className="bg-background min-h-14 resize-none border-0 shadow-none focus-visible:ring-0"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Paperclip className="size-4" />
                Attach file
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Radio className="size-4" />
                Start Talk
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground size-8">
                <Settings className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Plus className="size-4" />
                New session
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Upload className="size-4" />
                Export
              </Button>
              <Button size="sm" className="gap-1.5">
                <Send className="size-3.5" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
