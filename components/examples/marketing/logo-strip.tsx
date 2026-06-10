import { cn } from "@/lib/utils";

export function LogoStrip() {
  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 lg:gap-9 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-7">
          {logoMarks.map((LogoMark, index) => (
            <div key={index} className="text-muted-foreground flex shrink-0 items-center gap-2">
              <LogoMark className="size-7.5 lg:size-10" />
              <span className="text-lg font-medium tracking-tight lg:text-xl">Logoipsum</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-center text-sm">Trusted by leading companies</p>
      </div>
    </section>
  );
}

export function LogoMark1({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 40 40"
      className={cn("aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M25.093 1.054 21.16 0l-3.315 12.37-2.992-11.168-3.933 1.054 3.233 12.066L6.1 6.269l-2.88 2.88 8.834 8.832-11-2.947L0 18.967l12.019 3.22a8.144 8.144 0 1 1 15.869-.011l10.922 2.926 1.054-3.933-12.066-3.233 11-2.947-1.054-3.934-12.066 3.234 8.053-8.053-2.88-2.88-8.71 8.711z"
      />
      <path
        fill="currentColor"
        d="M27.877 22.221a8.1 8.1 0 0 1-2.026 3.733l7.913 7.913 2.88-2.88zm-2.106 3.816a8.14 8.14 0 0 1-3.639 2.151l2.88 10.746 3.933-1.054zm-3.786 2.19a8.2 8.2 0 0 1-2.033.256 8.2 8.2 0 0 1-2.172-.293l-2.882 10.756L18.83 40zm-4.345-.077a8.14 8.14 0 0 1-3.574-2.183L6.133 33.9l2.88 2.879zM14 25.897a8.1 8.1 0 0 1-1.976-3.686L1.066 25.147 2.12 29.08z"
      />
    </svg>
  );
}

export function LogoMark2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 40 40"
      className={cn("aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20m6.24-30.683c.303-1.079-.744-1.717-1.7-1.036L11.193 17.79c-1.037.738-.874 2.21.245 2.21h3.515v-.027h6.85l-5.582 1.97-2.46 8.74c-.304 1.079.743 1.717 1.699 1.036l13.347-9.509c1.037-.738.874-2.21-.245-2.21h-5.33z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LogoMark3({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 40 40"
      className={cn("aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.553 3.598c-1.43 1-2.725 2.183-3.848 3.514 4.59-.426 10.42.27 17.19 3.655 7.228 3.614 13.049 3.736 17.1 2.955a20 20 0 0 0-1.379-3.2c-4.637.49-10.582-.158-17.51-3.622-4.4-2.2-8.278-3.106-11.553-3.302m26.354 3.069A19.95 19.95 0 0 0 20 0c-1.74 0-3.427.222-5.036.64 2.179.594 4.494 1.464 6.93 2.682 5.073 2.537 9.452 3.353 13.013 3.345m4.954 10.961c-4.894.966-11.652.768-19.755-3.284-7.576-3.787-13.606-3.74-17.672-2.836q-.315.07-.615.147a20 20 0 0 0-1.262 3.64q.488-.132 1.01-.247C6.5 13.95 13.47 13.998 21.893 18.21 29.47 22 35.5 21.951 39.566 21.048q.21-.046.412-.096a20.3 20.3 0 0 0-.117-3.324m-.536 7.544c-4.847.848-11.408.522-19.22-3.383C12.53 18 6.5 18.049 2.435 18.952a20 20 0 0 0-2.431.703L0 20c0 11.046 8.954 20 20 20 9.257 0 17.045-6.29 19.325-14.828"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LogoMark4({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 40 40"
      className={cn("aspect-square", className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20m3.087-24.547a4.366 4.366 0 1 0-6.174 0L20 18.54zm1.46 7.634a4.366 4.366 0 1 0 0-6.174L21.462 20zm-1.46 7.634a4.366 4.366 0 0 0 0-6.174L20 21.462l-3.087 3.087a4.366 4.366 0 0 0 6.174 6.173M9.279 23.087a4.366 4.366 0 0 1 6.174-6.174L18.54 20l-3.087 3.087a4.366 4.366 0 0 1-6.174 0"
        clipRule="evenodd"
      />
    </svg>
  );
}

const logoMarks = [LogoMark1, LogoMark2, LogoMark3, LogoMark4];
