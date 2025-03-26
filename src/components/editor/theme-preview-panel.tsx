import { ThemeEditorPreviewProps } from "@/types/theme";
import { Settings, Info, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { lazy, Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
const DemoCards = lazy(() => import("@/components/examples/demo-cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));

const ThemePreviewPanel = ({ styles, currentMode }: ThemeEditorPreviewProps) => {
  if (!styles || !styles[currentMode]) {
    return null;
  }

  const renderColorPreview = (label: string, color: string) => (
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{color}</p>
      </div>
    </div>
  );

  return (
    <div className="max-h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Theme Preview</h2>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs defaultValue="cards" className="flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger className="hidden md:block" value="mail">
              Mail
            </TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Color Palette</TabsTrigger>
          </TabsList>

          <ScrollArea className="rounded-lg border mt-2 flex flex-col flex-1">
            <div className="flex flex-col flex-1">
              {/* Examples Preview */}
              <TabsContent value="cards" className="space-y-6 mt-0 py-4 px-4 h-full">
                <Suspense
                  fallback={
                    <div className="flex w-fit mx-auto flex-col space-y-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  }
                >
                  <DemoCards />
                </Suspense>
              </TabsContent>

              <TabsContent value="mail" className="space-y-6 mt-0 h-full @container">
                <Suspense
                  fallback={
                    <div className="flex w-fit mx-auto flex-col space-y-3">
                      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  }
                >
                  <div className="min-w-[1300px]">
                    <DemoMail />
                  </div>
                </Suspense>
              </TabsContent>

              {/* Components showcase - more organized by type */}
              <TabsContent value="components" className="p-4 space-y-6 mt-0">
                {/* Button showcase */}
                <section className="space-y-3">
                  <h3 className="text-sm font-medium border-b pb-2">
                    Buttons & Interactive Elements
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Delete</Button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications" />
                        <label htmlFor="notifications">Notifications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="darkmode" />
                        <label htmlFor="darkmode">Dark Mode</label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cards & Containers */}
                <section className="space-y-3">
                  <h3 className="text-sm font-medium border-b pb-2">
                    Cards & Containers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Feature Card</CardTitle>
                        <CardDescription>
                          Card description with muted foreground color
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          This card demonstrates the card background and foreground
                          colors, with content showing regular text.
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost">Cancel</Button>
                        <Button>Continue</Button>
                      </CardFooter>
                    </Card>

                    <div className="space-y-3">
                      <div
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: styles[currentMode].popover,
                          color: styles[currentMode]["popover-foreground"],
                          border: `1px solid ${styles[currentMode].border}`,
                        }}
                      >
                        <h4 className="text-sm font-medium mb-2">
                          Popover Container
                        </h4>
                        <p className="text-xs">
                          This container shows popover colors and styling.
                        </p>
                      </div>

                      <div
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: styles[currentMode].muted,
                          color: styles[currentMode]["muted-foreground"],
                        }}
                      >
                        <h4 className="text-sm font-medium mb-2">Muted Container</h4>
                        <p className="text-xs">
                          Container with muted background and foreground colors.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Status Indicators */}
                <section className="space-y-3">
                  <h3 className="text-sm font-medium border-b pb-2">
                    Status Indicators & Alerts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default Badge</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Error</Badge>
                      <Badge className="bg-blue-500 hover:bg-blue-600">Custom</Badge>
                    </div>

                    <div className="space-y-3">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                          Standard alert with default styling.
                        </AlertDescription>
                      </Alert>

                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          Destructive alert showcasing error state colors.
                        </AlertDescription>
                      </Alert>

                      <div
                        className="rounded-lg border p-4 flex items-start gap-3"
                        style={{
                          borderColor: styles[currentMode].border,
                          backgroundColor: `${styles[currentMode].accent}20`,
                        }}
                      >
                        <Star className="h-5 w-5 text-yellow-500 shrink-0" />
                        <div>
                          <h5 className="font-medium text-sm">Success Alert</h5>
                          <p className="text-xs mt-1">
                            Custom alert using accent colors with an opacity
                            modifier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Display */}
                <section className="space-y-3">
                  <h3 className="text-sm font-medium border-b pb-2">Data Display</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Alex Johnson</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600"
                          >
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sarah Chen</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-destructive/10 text-destructive"
                          >
                            Inactive
                          </Badge>
                        </TableCell>
                        <TableCell>User</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </section>
              </TabsContent>

              {/* Better organized color palette */}
              <TabsContent value="colors" className="p-4 space-y-6">
                <div className="grid grid-cols-1 gap-8">
                  {/* Primary Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Primary Theme Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview(
                        "Background",
                        styles[currentMode].background
                      )}
                      {renderColorPreview(
                        "Foreground",
                        styles[currentMode].foreground
                      )}
                      {renderColorPreview("Primary", styles[currentMode].primary)}
                      {renderColorPreview(
                        "Primary Foreground",
                        styles[currentMode]["primary-foreground"]
                      )}
                    </div>
                  </div>

                  {/* Secondary & Accent Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Secondary & Accent Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview(
                        "Secondary",
                        styles[currentMode].secondary
                      )}
                      {renderColorPreview(
                        "Secondary Foreground",
                        styles[currentMode]["secondary-foreground"]
                      )}
                      {renderColorPreview("Accent", styles[currentMode].accent)}
                      {renderColorPreview(
                        "Accent Foreground",
                        styles[currentMode]["accent-foreground"]
                      )}
                    </div>
                  </div>

                  {/* UI Component Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      UI Component Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview("Card", styles[currentMode].card)}
                      {renderColorPreview(
                        "Card Foreground",
                        styles[currentMode]["card-foreground"]
                      )}
                      {renderColorPreview("Popover", styles[currentMode].popover)}
                      {renderColorPreview(
                        "Popover Foreground",
                        styles[currentMode]["popover-foreground"]
                      )}
                      {renderColorPreview("Muted", styles[currentMode].muted)}
                      {renderColorPreview(
                        "Muted Foreground",
                        styles[currentMode]["muted-foreground"]
                      )}
                    </div>
                  </div>

                  {/* Utility & Form Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Utility & Form Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview("Border", styles[currentMode].border)}
                      {renderColorPreview("Input", styles[currentMode].input)}
                      {renderColorPreview("Ring", styles[currentMode].ring)}
                      {renderColorPreview("Radius", styles[currentMode].radius)}
                    </div>
                  </div>

                  {/* Status & Feedback Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Status & Feedback Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview(
                        "Destructive",
                        styles[currentMode].destructive
                      )}
                      {renderColorPreview(
                        "Destructive Foreground",
                        styles[currentMode]["destructive-foreground"]
                      )}
                    </div>
                  </div>

                  {/* Chart & Data Visualization Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Chart & Visualization Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview("Chart 1", styles[currentMode]["chart-1"])}
                      {renderColorPreview("Chart 2", styles[currentMode]["chart-2"])}
                      {renderColorPreview("Chart 3", styles[currentMode]["chart-3"])}
                      {renderColorPreview("Chart 4", styles[currentMode]["chart-4"])}
                      {renderColorPreview("Chart 5", styles[currentMode]["chart-5"])}
                    </div>
                  </div>

                  {/* Sidebar Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium border-b pb-2">
                      Sidebar & Navigation Colors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderColorPreview(
                        "Sidebar Background",
                        styles[currentMode].sidebar
                      )}
                      {renderColorPreview(
                        "Sidebar Foreground",
                        styles[currentMode]["sidebar-foreground"]
                      )}
                      {renderColorPreview(
                        "Sidebar Primary",
                        styles[currentMode]["sidebar-primary"]
                      )}
                      {renderColorPreview(
                        "Sidebar Primary Foreground",
                        styles[currentMode]["sidebar-primary-foreground"]
                      )}
                      {renderColorPreview(
                        "Sidebar Accent",
                        styles[currentMode]["sidebar-accent"]
                      )}
                      {renderColorPreview(
                        "Sidebar Accent Foreground",
                        styles[currentMode]["sidebar-accent-foreground"]
                      )}
                      {renderColorPreview(
                        "Sidebar Border",
                        styles[currentMode]["sidebar-border"]
                      )}
                      {renderColorPreview(
                        "Sidebar Ring",
                        styles[currentMode]["sidebar-ring"]
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemePreviewPanel;
