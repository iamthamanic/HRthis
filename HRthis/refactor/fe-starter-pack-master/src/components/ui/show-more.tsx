import { ChevronDown } from "lucide-react";

export default function ShowMore({ onClick }: { onClick?: () => void }) {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onClick ? onClick : () => {}}
        className="flex items-center text-amber-500 hover:text-amber-600 font-medium"
      >
        Show More
        <ChevronDown className="ml-1" />
      </button>
    </div>
  );
}
