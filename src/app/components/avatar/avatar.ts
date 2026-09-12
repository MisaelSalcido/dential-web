import { Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'square';
export type AvatarVariant = 'tint' | 'solid';

const SIZE_PX: Record<AvatarSize, number> = { sm: 34, md: 52, lg: 66 };

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-[34px] text-xs',
  md: 'size-[52px] text-lg',
  lg: 'size-[66px] text-2xl',
};

const SQUARE_RADIUS: Record<AvatarSize, string> = {
  sm: 'rounded-xl',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
};

const VARIANT_CLASSES: Record<AvatarVariant, string> = {
  tint: 'bg-primary-tint text-primary-strong',
  solid: 'bg-primary text-white',
};

@Component({
  selector: 'app-avatar',
  host: { class: 'contents' },
  styleUrl: './avatar.css',
  imports: [NgOptimizedImage],
  template: `
    <span
      class="inline-flex shrink-0 items-center justify-center overflow-hidden font-heading font-medium"
      [class]="classes()"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-hidden]="ariaLabel() ? null : 'true'"
    >
      @if (src()) {
        <img [ngSrc]="src()!" [width]="sizePx()" [height]="sizePx()" class="size-full object-cover" />
      } @else {
        {{ initials() }}
      }
    </span>
  `,
})
export class Avatar {
  initials = input<string>('');
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  variant = input<AvatarVariant>('tint');
  src = input<string | null>(null);
  ariaLabel = input<string | null>(null);

  protected sizePx = computed(() => SIZE_PX[this.size()]);

  protected classes = computed(() => {
    const shapeClasses = this.shape() === 'circle' ? 'rounded-full' : SQUARE_RADIUS[this.size()];
    return [SIZE_CLASSES[this.size()], VARIANT_CLASSES[this.variant()], shapeClasses].join(' ');
  });
}
