import Image from "next/image";

type Size = "sm" | "default";

const config: Record<Size, { img: number; textClass: string }> = {
  sm: { img: 22, textClass: "text-base font-semibold" },
  default: { img: 32, textClass: "text-xl font-bold" },
};

export default function ViewcakeLogo({
  size = "default",
  iconOnly = false,
  className = "",
}: {
  size?: Size;
  iconOnly?: boolean;
  className?: string;
}) {
  const { img, textClass } = config[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/viewcake-logo.png"
        alt="Viewcake"
        width={img}
        height={img}
        className="shrink-0 rounded-full"
        priority
      />
      {!iconOnly && (
        <span className={textClass}>Viewcake</span>
      )}
    </span>
  );
}
