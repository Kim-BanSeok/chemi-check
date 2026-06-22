interface TestSelectorBackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function TestSelectorBackButton({
  onClick,
  label = '테스트 선택으로',
}: TestSelectorBackButtonProps) {
  return (
    <button
      type="button"
      aria-label={`← ${label}`}
      onClick={onClick}
      className="group relative mb-6 inline-flex overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 p-[2px] shadow-lg shadow-pink-200/70 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-200/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
    >
      <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-black">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-600 text-base text-white shadow-sm transition duration-300 group-hover:-translate-x-0.5">
          ←
        </span>
        <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-700 bg-clip-text text-transparent">
          {label}
        </span>
        <span aria-hidden="true" className="text-base text-amber-400 transition duration-300 group-hover:rotate-12 group-hover:scale-125">
          ✨
        </span>
      </span>
    </button>
  );
}
