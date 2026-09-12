import { getFormFieldClasses } from './form-field-classes.util';

describe('getFormFieldClasses', () => {
  it('should return the default border classes when there is no error or warning', () => {
    expect(getFormFieldClasses({ hasError: false, warning: false })).toContain('border-line-strong');
  });

  it('should return the warning border classes when warning is true', () => {
    expect(getFormFieldClasses({ hasError: false, warning: true })).toContain('border-warning');
  });

  it('should prioritize error classes over warning classes', () => {
    const classes = getFormFieldClasses({ hasError: true, warning: true });
    expect(classes).toContain('border-danger');
    expect(classes).not.toContain('border-warning');
  });
});
