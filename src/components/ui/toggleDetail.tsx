import React from "react";
const ToggleableField = ({
  label,
  value,
  codeLabel,
  codeValue,
  codeLabel2,
  codeValue2,
}: {
  label: string;
  value: string;
  codeLabel: string;
  codeValue: string;
  codeLabel2?: string;
  codeValue2?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <div className="flex gap-1">
          <p className="text-base text-[#00000099]">{label}:</p>
          <p className="text-base text-redberry">{value}</p>
        </div>
        <button
          type="button"
          tabIndex={0}
          aria-label={isOpen ? `Ẩn ${codeLabel}` : `Hiện ${codeLabel}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className="ml-2 px-2 py-1 w-6 h-6 flex items-center justify-center text-xs text-gray-700 cursor-pointer"
        >
          {isOpen ? (
            <i className="mdi mdi-chevron-up"></i>
          ) : (
            <i className="mdi mdi-chevron-down"></i>
          )}
        </button>
      </div>
      {isOpen && (
        <div className="px-6 pb-4 flex items-center justify-start gap-24 animate-fade-in">
          <div className="flex gap-1">
            <span className="text-base text-[#00000099]">{codeLabel}:</span>
            <span className="text-base text-redberry">{codeValue}</span>
          </div>
          {(codeLabel2 || codeValue2) && (
            <div className="flex gap-1">
              {codeLabel2 && (
                <span className="text-base text-[#00000099]">
                  {codeLabel2}:
                </span>
              )}
              {codeValue2 && (
                <span className="text-base text-redberry">{codeValue2}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleableField;
