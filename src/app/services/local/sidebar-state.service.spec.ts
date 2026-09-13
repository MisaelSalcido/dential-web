import { TestBed } from '@angular/core/testing';
import { SidebarStateService } from './sidebar-state.service';

describe('SidebarStateService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    const service = TestBed.inject(SidebarStateService);
    expect(service).toBeTruthy();
  });

  it('should default to expanded when nothing is stored and the viewport is not narrow', () => {
    const service = TestBed.inject(SidebarStateService);
    expect(service.collapsed()).toBe(false);
  });

  it('should toggle the collapsed state', () => {
    const service = TestBed.inject(SidebarStateService);
    service.toggle();
    expect(service.collapsed()).toBe(true);
    service.toggle();
    expect(service.collapsed()).toBe(false);
  });

  it('should persist the collapsed state to localStorage on every change', () => {
    const service = TestBed.inject(SidebarStateService);
    service.toggle();
    TestBed.flushEffects();
    expect(localStorage.getItem('dential.sidebar.collapsed')).toBe('true');
  });

  it('should read a persisted collapsed value on construction', () => {
    localStorage.setItem('dential.sidebar.collapsed', 'true');
    const service = TestBed.inject(SidebarStateService);
    expect(service.collapsed()).toBe(true);
  });
});
