import { ButtonVariant } from '../components/button/button';

export interface QuickAction {
  key: string;
  label: string;
  variant: ButtonVariant;
  targetPath: string;
}
