export function ToolbarButton({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // 클릭 시 textarea가 blur되면 selectionStart/End가 초기화되므로
      // mousedown에서 막아 포커스가 그대로 유지되게 한다.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}

export function ToolbarDivider() {
  return <div className="mx-1.5 h-5 w-px shrink-0 bg-neutral-200" />;
}
