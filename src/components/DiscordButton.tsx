import { type ComponentProps } from "react";

interface Props extends ComponentProps<"a"> {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost";
  label?: string;
}

const DISCORD_URL = "https://discord.gg/PXGYhvbVH";

export function DiscordButton({
  size = "md",
  variant = "solid",
  label = "Discord",
  className = "",
  ...rest
}: Props) {
  const sizing =
    size === "sm"
      ? "h-9 px-4 text-xs gap-1.5"
      : size === "lg"
      ? "h-14 px-7 text-base gap-2.5"
      : "h-12 px-6 text-sm gap-2";

  const base =
    "group relative inline-flex items-center justify-center rounded-xl font-semibold tracking-wide overflow-hidden transition-all duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0";

  const solid =
    "text-white bg-[linear-gradient(135deg,#5865F2_0%,#7983ff_50%,#5865F2_100%)] bg-[length:200%_200%] bg-left hover:bg-right shadow-[0_8px_24px_-8px_rgba(88,101,242,0.6)] hover:shadow-[0_12px_36px_-8px_rgba(88,101,242,0.85),0_0_0_1px_rgba(121,131,255,0.4)_inset]";

  const ghost =
    "text-[#9aa3ff] bg-[#5865F2]/8 border border-[#5865F2]/40 hover:bg-[#5865F2]/15 hover:text-white hover:border-[#7983ff] hover:shadow-[0_0_24px_-4px_rgba(88,101,242,0.55)]";

  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${sizing} ${variant === "solid" ? solid : ghost} ${className}`}
      {...rest}
    >
      {/* sheen */}
      {variant === "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)]"
        />
      )}
      <svg
        viewBox="0 0 24 24"
        className={`${iconSize} fill-current relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]`}
        aria-hidden
      >
        <path d="M20.317 4.369A19.79 19.79 0 0016.558 3a14.9 14.9 0 00-.69 1.418 18.27 18.27 0 00-5.736 0A14.9 14.9 0 009.44 3a19.79 19.79 0 00-3.76 1.369C2.197 9.547 1.27 14.59 1.733 19.563A19.93 19.93 0 007.84 22.5a14.7 14.7 0 001.272-2.07 12.83 12.83 0 01-2.005-.967c.168-.122.332-.25.49-.382a14.27 14.27 0 0012.806 0c.16.132.323.26.49.382a12.84 12.84 0 01-2.008.968 14.7 14.7 0 001.272 2.069 19.92 19.92 0 006.108-2.937c.55-5.766-.928-10.764-3.948-15.194zM8.02 16.515c-1.214 0-2.213-1.118-2.213-2.49 0-1.371.98-2.49 2.213-2.49 1.234 0 2.234 1.119 2.213 2.49 0 1.372-.979 2.49-2.213 2.49zm7.96 0c-1.214 0-2.213-1.118-2.213-2.49 0-1.371.98-2.49 2.213-2.49 1.234 0 2.234 1.119 2.213 2.49 0 1.372-.979 2.49-2.213 2.49z" />
      </svg>
      <span className="relative z-10">{label}</span>
    </a>
  );
}
