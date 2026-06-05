interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 font-sans font-medium transition-colors ${
      isActive
        ? "border-b-2 border-brand text-brand"
        : "text-gray-500 hover:text-gray-900"
    }`}
  >
    {label}
  </button>
);

