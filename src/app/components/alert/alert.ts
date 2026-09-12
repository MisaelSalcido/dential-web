import { Component, computed, input } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_CONTAINER_CLASSES: Record<AlertVariant, string> = {
  info: 'border-primary/30 bg-primary-tint',
  success: 'border-success/30 bg-success-tint',
  warning: 'border-warning-border bg-warning-tint',
  danger: 'border-danger/30 bg-danger-tint',
};

const VARIANT_TITLE_CLASSES: Record<AlertVariant, string> = {
  info: 'text-primary-strong',
  success: 'text-success-text',
  warning: 'text-warning-heading',
  danger: 'text-danger-text',
};

const VARIANT_BODY_CLASSES: Record<AlertVariant, string> = {
  info: 'text-primary-strong',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
};

const VARIANT_ROLE: Record<AlertVariant, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

@Component({
  selector: 'app-alert',
  host: { class: 'contents' },
  styleUrl: './alert.css',
  template: `
    <div class="flex items-start gap-3 rounded-lg border p-4" [class]="containerClasses()" [attr.role]="role()">
      <ng-content select="[icon]" />
      <div class="flex-1">
        @if (title()) {
          <p class="font-heading text-sm font-medium" [class]="titleClasses()">{{ title() }}</p>
        }
        <div class="text-sm" [class]="bodyClasses()">
          <ng-content />
        </div>
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
})
export class Alert {
  variant = input<AlertVariant>('info');
  title = input<string | null>(null);

  protected containerClasses = computed(() => VARIANT_CONTAINER_CLASSES[this.variant()]);
  protected titleClasses = computed(() => VARIANT_TITLE_CLASSES[this.variant()]);
  protected bodyClasses = computed(() => VARIANT_BODY_CLASSES[this.variant()]);
  protected role = computed(() => VARIANT_ROLE[this.variant()]);
}
