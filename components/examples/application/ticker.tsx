import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const tickers = [
  { symbol: "SDCN", name: "Shadcn Inc.", amount: 120748.0, change: 1.25 },
  { symbol: "ACME", name: "Acme Corp.", amount: 84231.5, change: -0.42 },
  { symbol: "TWKN", name: "Tweakcn Ltd.", amount: 45019.75, change: 2.18 },
  { symbol: "VEGA", name: "Vega Systems", amount: 9874.2, change: -1.07 },
];

export function TickerStrip() {
  return (
    <Card className="py-3">
      <CardContent className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4">
        {tickers.map((ticker, index) => (
          <div key={ticker.symbol} className="flex items-center gap-5">
            {index > 0 && <Separator orientation="vertical" className="hidden !h-6 sm:block" />}
            <Ticker {...ticker} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Ticker({
  symbol,
  name,
  amount,
  change,
}: {
  symbol: string;
  name: string;
  amount: number;
  change: number;
}) {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <Avatar className="size-6">
        <AvatarFallback className="text-muted-foreground text-xs font-medium uppercase">
          {name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{symbol}</span>
      <span className="text-muted-foreground text-sm tabular-nums">
        {currencyFormatter.format(amount)}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-sm tabular-nums",
          isPositive ? "text-chart-2" : "text-destructive"
        )}
      >
        <svg
          aria-hidden="true"
          className={cn("size-2.5", !isPositive && "rotate-180")}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 22h-24l12-20z" />
        </svg>
        {change.toFixed(2)}%
      </span>
    </div>
  );
}
