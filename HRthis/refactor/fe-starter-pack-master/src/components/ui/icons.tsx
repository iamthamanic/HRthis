import { cn } from "@/lib/utils";

export const Icons = {
  CircleIcon: ({ className, progress }: React.SVGProps<SVGSVGElement> & { progress: number }) => (
    <svg className={cn("w-full h-full", className)} viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        className={cn("stroke-gray-200", className)}
        strokeWidth="4"
      />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        className="stroke-primary"
        strokeWidth="4"
        strokeDasharray="100"
        strokeDashoffset={100 - progress}
        transform="rotate(-90 18 18)"
      />
      <text x="19" y="21" textAnchor="middle" className="text-[8px] font-medium fill-gray-700">
        {progress}%
      </text>
    </svg>
  ),
};
