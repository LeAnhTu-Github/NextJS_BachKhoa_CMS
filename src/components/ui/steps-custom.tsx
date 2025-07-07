import { Button } from "@/components/ui/button";

export type StepItem = {
  title: string;
  content: React.ReactNode;
};

type CustomStepProps = {
  onNext?: () => void;
  steps: StepItem[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onFinish?: () => void;
  hideNavButtons?: boolean;
  isSelect?: boolean;
};

export default function CustomStep({
  onNext,
  steps,
  currentStep,
  setCurrentStep,
  onFinish,
  isSelect,
  hideNavButtons = false,
}: CustomStepProps) {
  const isLast = currentStep === steps.length - 1;
  // const isFirst = currentStep === 0;

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onNext?.();
    if (isLast) {
      onFinish?.();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   onBack?.();
  //   if (!isFirst) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-8 relative">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          return (
            <div key={index} className="flex items-start gap-2 relative z-10">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? "bg-red-700 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`text-sm font-medium ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            </div>
          );
        })}

        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200 z-0"></div>
      </div>

      <div className="flex-1 space-y-6">
        {steps[currentStep].content}

        {!hideNavButtons && (
          <div className="flex gap-2 justify-end pr-10">
            {!isLast && (
              <Button
                onClick={handleNext}
                disabled={!isSelect}
                className={`${
                  isSelect
                    ? "bg-redberry text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                Tiếp tục
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
