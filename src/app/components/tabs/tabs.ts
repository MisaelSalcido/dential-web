import { Component, ElementRef, input, model, viewChildren } from '@angular/core';
import { TabItem } from '../../models/tab-item.model';

let nextGroupId = 0;

/**
 * Renders only the tablist header. The consumer owns and renders the
 * `role="tabpanel"` content, gated on `activeTab()`, using `panelId()`/`tabId()`
 * to wire up `aria-controls`/`aria-labelledby`.
 */
@Component({
  selector: 'app-tabs',
  host: { class: 'contents' },
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  tabs = input<TabItem[]>([]);
  activeTab = model<string>('');
  ariaLabel = input<string>('');

  private groupId = `tabs-${nextGroupId++}`;
  private tabRefs = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  tabId(tab: TabItem): string {
    return `${this.groupId}-tab-${tab.id}`;
  }

  panelId(tab: TabItem): string {
    return `${this.groupId}-panel-${tab.id}`;
  }

  protected tabClasses(tab: TabItem): string {
    if (tab.locked) {
      return 'border-transparent text-ink-subtle cursor-not-allowed';
    }
    return this.activeTab() === tab.id
      ? 'border-primary text-ink font-medium'
      : 'border-transparent text-ink-muted hover:text-ink';
  }

  protected tabIndexFor(tab: TabItem, index: number): number {
    const activeIndex = this.tabs().findIndex((t) => t.id === this.activeTab());
    const fallbackIndex = this.tabs().findIndex((t) => !t.locked);
    const targetIndex = activeIndex !== -1 ? activeIndex : fallbackIndex;
    return index === targetIndex ? 0 : -1;
  }

  protected select(tab: TabItem): void {
    if (tab.locked) {
      return;
    }
    this.activeTab.set(tab.id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs();
    const enabledIndexes = tabs.reduce<number[]>((acc, t, i) => {
      if (!t.locked) acc.push(i);
      return acc;
    }, []);
    if (enabledIndexes.length === 0) {
      return;
    }

    const currentIndex = tabs.findIndex((t) => t.id === this.activeTab());
    const baseIndex = currentIndex !== -1 ? currentIndex : enabledIndexes[0];

    let targetIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        targetIndex = this.stepEnabled(baseIndex, 1, enabledIndexes, tabs.length);
        break;
      case 'ArrowLeft':
        targetIndex = this.stepEnabled(baseIndex, -1, enabledIndexes, tabs.length);
        break;
      case 'Home':
        targetIndex = enabledIndexes[0];
        break;
      case 'End':
        targetIndex = enabledIndexes[enabledIndexes.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    const tab = tabs[targetIndex];
    this.activeTab.set(tab.id);
    this.tabRefs()[targetIndex]?.nativeElement.focus();
  }

  private stepEnabled(current: number, direction: number, enabledIndexes: number[], total: number): number {
    let index = current;
    for (let step = 0; step < total; step++) {
      index = (index + direction + total) % total;
      if (enabledIndexes.includes(index)) {
        return index;
      }
    }
    return current;
  }
}
