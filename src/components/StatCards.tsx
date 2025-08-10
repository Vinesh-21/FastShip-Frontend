import type { StatCardProp } from "@/types/statCard";

const colorMap: Record<StatCardProp["color"], string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  red: "bg-red-500",
};

function StatCards({ title, statNumber, color }: StatCardProp) {
  return (
    <div className="px-4 py-3 w-[260px] h-[120px] border rounded-xl border-stone-400/30 bg-white drop-shadow-lg relative ">
      <div
        className={`h-3 w-3 rounded-lg absolute right-6 ${colorMap[color]} ${
          !(statNumber === 0) ? "animate-pulse" : ""
        }`}
      ></div>
      <div className="flex justify-between flex-col w-full h-full py-3">
        <p className="text-2xl font-bold text-slate-900/80">{title}</p>
        <p className="text-3xl text-slate-900/90">{statNumber}</p>
      </div>
    </div>
  );
}

export default StatCards;
