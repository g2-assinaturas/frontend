import React, { useEffect, useMemo, useState } from 'react';

type MultiStepFormProps<TData = Record<string, unknown>> = {
  children: React.ReactNode[];
  onSubmit: (data?: TData) => void | Promise<void>;
  isSubmitting?: boolean;
  canProceed?: boolean;
  onStepChange?: (stepIndex: number) => void;
};

type StepProps = {
  formId?: string;
  onValidSubmit?: () => void;
};

export function MultiStepForm<TData = Record<string, unknown>>({ children, onSubmit, isSubmitting, canProceed = true, onStepChange }: MultiStepFormProps<TData>) {
  const steps = useMemo(() => React.Children.toArray(children), [children]);
  const [currentStep, setCurrentStep] = useState(0);
  const formId = `multi-step-form-${currentStep}`;

  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canProceed) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Último passo - submeter o formulário
      onSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepElement = React.isValidElement(steps[currentStep])
    ? React.cloneElement(steps[currentStep] as React.ReactElement<StepProps>, {
        formId,
        onValidSubmit: handleNext,
      })
    : steps[currentStep];

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 text-sm font-semibold text-ink-700 dark:text-slate-300">
        Passo {currentStep + 1} de {steps.length}
      </div>

      <div className="mb-6">{currentStepElement}</div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-900 disabled:opacity-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
          disabled={currentStep === 0}
        >
          Anterior
        </button>

        <div className="flex gap-3">
          {!isLastStep && (
            <button
              type="submit"
              form={formId}
              className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-ink-50 shadow-card hover:-translate-y-0.5 hover:shadow-lg transition dark:bg-slate-600 dark:hover:bg-slate-500"
              disabled={!!isSubmitting || !canProceed}
            >
              Próximo
            </button>
          )}

          {isLastStep && (
            <button
              type="submit"
              form={formId}
              disabled={!!isSubmitting || !canProceed}
              className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-ink-50 shadow-card hover:-translate-y-0.5 hover:shadow-lg transition disabled:opacity-60 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
