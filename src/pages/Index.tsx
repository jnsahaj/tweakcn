import GitHubIcon from "@/assets/github.svg?react";
import logo from "@/assets/logo.png";
import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getEditorConfig } from "@/config/editors";
import { deserializeEditorState, serializeEditorState } from "@/utils/shareUtils";
import { Heart, Moon, Share, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import EditorCombobox from "../components/editor/EditorCombobox";
import { useTheme } from "../components/theme-provider";
import { cn } from "../lib/utils";

const Index = () => {
  const { editorType = "button" } = useParams();
  const editorConfig = getEditorConfig(editorType);
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stargazersCount, setStargazersCount] = useState(0);

  const generateShareLink = () => {
    const serializedState = serializeEditorState();
    if (!serializedState) {
      toast({
        title: "Error",
        description: "Could not generate a share link. Try again later.",
        variant: "destructive",
      });
      return;
    }

    //Do you also want to update the URL with serialized state without navigating?
    //setSearchParams({ theme: serializedState });

    // Copy to clipboard
    const shareUrl = `${window.location.origin}${window.location.pathname}?theme=${serializedState}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy the link to clipboard.",
          variant: "destructive",
        });
      });
  };

  useEffect(() => {
    // Check for state parameter in URL
    const stateParam = searchParams.get('theme');
    if (stateParam) {
      const success = deserializeEditorState(stateParam);
      if (success) {
        toast({
          title: "State loaded",
          description: "Shared configuration has been applied.",
        });

        // Clear the state parameter from URL to avoid reloading on refresh
        // but keep the current path
        navigate(window.location.pathname, { replace: true });

        // Force a reload to apply the new state from localStorage
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Could not load the shared configuration.",
          variant: "destructive",
        });
      }
    }
  }, []);

  useEffect(() => {
    const owner = "jnsahaj";
    const repo = "tweakcn";

    const fetchData = async () => {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      const data = await response.json();
      setStargazersCount(data.stargazers_count);
    };

    fetchData();
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col text-foreground bg-background transition-colors",
      )}
    >
      <header className="border-b">
        <div className="px-2 md:px-4 py-4 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1">
            <img src={logo} alt="tweakcn" className="h-8 w-8 mr-1 md:mr-2" title="Nothing here yet..." />
            <EditorCombobox />
            <Button variant="secondary" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={generateShareLink}>
              <Share className="h-5 w-5" />
            </Button>
            <Link
              to="https://github.com/sponsors/jnsahaj"
              target="_blank"
            >
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" stroke="#c96198" fill="#c96198" />
              </Button>
            </Link>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/jnsahaj/tweakcn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
              >
                <GitHubIcon className="h-5 w-5" />
                {stargazersCount > 0 && stargazersCount}
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Editor config={editorConfig} />
      </main>
    </div>
  );
};

export default Index;
