import { AppSidebar } from "@/components/examples/dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/examples/dashboard/components/chart-area-interactive";
import { DataTable } from "@/components/examples/dashboard/components/data-table";
import { SectionCards } from "@/components/examples/dashboard/components/section-cards";
import { SiteHeader } from "@/components/examples/dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartPieDonut } from "./components/chart-pie-donut";
import { ChartBarMixed } from "./components/chart-bar-mixed";

import data from "./data.json";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
              <div className="flex gap-4 px-4 lg:px-6">
                <div className="basis-1/2">
                  <ChartPieDonut />
                </div>
                <div className="basis-1/2">
                  <ChartBarMixed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
