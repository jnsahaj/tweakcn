import { CardsActivityGoal } from "@/components/examples/cards/activity-goal";
import { CardsCalendar } from "@/components/examples/cards/calendar";
import { CardsChat } from "@/components/examples/cards/chat";
import { CardsCookieSettings } from "@/components/examples/cards/cookie-settings";
import { CardsCreateAccount } from "@/components/examples/cards/create-account";
import { CardsExerciseMinutes } from "@/components/examples/cards/exercise-minutes";
import { CardsForms } from "@/components/examples/cards/forms";
import { CardsPayments } from "@/components/examples/cards/payments";
import { CardsReportIssue } from "@/components/examples/cards/report-issue";
import { CardsShare } from "@/components/examples/cards/share";
import { CardsStats } from "@/components/examples/cards/stats";
import { CardsTeamMembers } from "@/components/examples/cards/team-members";
import { DatePickerWithRange } from "./date-picker-with-range";
import { GithubCard } from "./github-card";

export default function CardsDemo() {
  return (
    <div className="@3xl:grids-col-2 grid p-2 **:data-[slot=card]:shadow-none md:p-4 @3xl:gap-4 @5xl:grid-cols-10 @7xl:grid-cols-11">
      <div className="grid gap-4 @5xl:col-span-4 @7xl:col-span-6">
        <CardsStats />
        <div className="grid gap-1 @2xl:grid-cols-[auto_1fr] @3xl:hidden">
          <CardsCalendar />
          <div className="@2xl:pt-0 @2xl:pl-3 @7xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 @2xl:col-span-2 @7xl:pt-4">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-1 @7xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            <CardsForms />
            <CardsTeamMembers />
            <CardsCookieSettings />
            <div className="hidden flex-col gap-4 @7xl:flex">
              <GithubCard />
              <DatePickerWithRange />
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-4">
            <CardsCreateAccount />
            <CardsChat />
            <GithubCard />
            <DatePickerWithRange />

            <div className="hidden @7xl:block">
              <CardsReportIssue />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 @5xl:col-span-6 @7xl:col-span-5">
        <div className="hidden gap-1 @2xl:grid-cols-[auto_1fr] @3xl:grid">
          <CardsCalendar />
          <div className="pt-3 @2xl:pt-0 @2xl:pl-3 @7xl:pl-4">
            <CardsActivityGoal />
          </div>
          <div className="pt-3 @2xl:col-span-2 @7xl:pt-3">
            <CardsExerciseMinutes />
          </div>
        </div>
        <div className="hidden @3xl:block">
          <CardsPayments />
        </div>
        <CardsShare />
        <div className="@7xl:hidden">
          <CardsReportIssue />
        </div>
      </div>
    </div>
  );
}
