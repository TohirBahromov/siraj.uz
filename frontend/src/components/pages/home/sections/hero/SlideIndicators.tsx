function SlideIndicators({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Slide ${i + 1}`}
          className="group p-1"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 group-hover:bg-white/70"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default SlideIndicators;
