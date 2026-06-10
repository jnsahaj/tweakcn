"use client";

import { FeaturedIcon } from "@/components/examples/application/featured-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Building2Icon, CircleDollarSignIcon, LandmarkIcon, WalletIcon } from "lucide-react";

const transactions = [
  {
    icon: LandmarkIcon,
    title: "Tax Refund",
    description: "2024 Income Tax Refund",
    amount: 542,
    date: "Dec 20",
  },
  {
    icon: WalletIcon,
    title: "Freelance Payment",
    description: "Payment for Invoice #INV-4421 - Website redesign project",
    amount: 800,
    date: "Dec 14",
  },
  {
    icon: Building2Icon,
    title: "Salary Payment",
    description: "Monthly salary - Acme Corporation SRL, Payroll November 2025",
    amount: 2500,
    date: "Dec 01",
  },
];

export function Transactions() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <CircleDollarSignIcon className="text-muted-foreground size-4" />
          Transactions
        </CardTitle>
        <CardAction>
          <Select defaultValue="last-month">
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-day">Last 24 hours</SelectItem>
              <SelectItem value="last-week">Last 7 days</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
              <SelectItem value="year-to-date">Year to date</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        <Tabs defaultValue="completed">
          <TabsList>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>

      <CardContent className="flex flex-col gap-5">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.title} {...transaction} />
        ))}
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="w-full">
          View all
        </Button>
      </CardFooter>
    </Card>
  );
}

function TransactionItem({
  icon: Icon,
  title,
  description,
  amount,
  date,
}: (typeof transactions)[number]) {
  const isPositive = amount >= 0;
  const formattedAmount = `${isPositive ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;

  return (
    <div className="flex gap-2.5">
      <FeaturedIcon>
        <Icon />
      </FeaturedIcon>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-xs">{description}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            isPositive ? "text-chart-2" : "text-destructive"
          )}
        >
          {formattedAmount}
        </span>
        <span className="text-muted-foreground text-xs">{date}</span>
      </div>
    </div>
  );
}
