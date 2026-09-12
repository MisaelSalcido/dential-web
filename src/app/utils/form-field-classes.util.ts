export interface FormFieldState {
  hasError: boolean;
  warning: boolean;
}

const BASE_FIELD_CLASSES =
  'w-full rounded-md border bg-surface text-base text-ink placeholder:text-ink-subtle ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12 focus-visible:border-primary ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const DEFAULT_BORDER_CLASSES = 'border-line-strong';
const WARNING_BORDER_CLASSES = 'border-warning';
const ERROR_BORDER_CLASSES = 'border-danger bg-danger-surface';

export function getFormFieldClasses(state: FormFieldState): string {
  const stateClasses = state.hasError
    ? ERROR_BORDER_CLASSES
    : state.warning
      ? WARNING_BORDER_CLASSES
      : DEFAULT_BORDER_CLASSES;

  return [BASE_FIELD_CLASSES, stateClasses].join(' ');
}
