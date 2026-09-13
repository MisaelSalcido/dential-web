import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HotkeyService } from './hotkey.service';

function keydown(init: KeyboardEventInit): KeyboardEvent {
  return new KeyboardEvent('keydown', { cancelable: true, ...init });
}

describe('HotkeyService', () => {
  let service: HotkeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotkeyService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should invoke the matching handler and prevent the default action', () => {
    const handler = vi.fn();
    service.register('ctrl+Digit1', handler);

    const event = keydown({ ctrlKey: true, code: 'Digit1' });
    service.handleKeydownEvent(event);

    expect(handler).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it('should do nothing for an unregistered combo', () => {
    const event = keydown({ ctrlKey: true, code: 'Digit9' });
    expect(() => service.handleKeydownEvent(event)).not.toThrow();
    expect(event.defaultPrevented).toBe(false);
  });

  it('should not fire when an extra modifier is held', () => {
    const handler = vi.fn();
    service.register('ctrl+Digit1', handler);

    service.handleKeydownEvent(keydown({ ctrlKey: true, shiftKey: true, code: 'Digit1' }));
    service.handleKeydownEvent(keydown({ ctrlKey: true, altKey: true, code: 'Digit1' }));
    service.handleKeydownEvent(keydown({ ctrlKey: true, metaKey: true, code: 'Digit1' }));
    service.handleKeydownEvent(keydown({ ctrlKey: false, code: 'Digit1' }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should throw when registering an already-used combo', () => {
    service.register('ctrl+Digit1', vi.fn());
    expect(() => service.register('ctrl+Digit1', vi.fn())).toThrowError(/already registered/);
  });

  it('should stop firing a handler once its returned unregister function is called', () => {
    const handler = vi.fn();
    const unregister = service.register('ctrl+Digit1', handler);

    unregister();
    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit1' }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should allow a combo to be re-registered after being unregistered', () => {
    const first = vi.fn();
    const second = vi.fn();
    const unregister = service.register('ctrl+Digit1', first);
    unregister();

    expect(() => service.register('ctrl+Digit1', second)).not.toThrow();

    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit1' }));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('should unregister only the targeted binding, leaving others intact', () => {
    const digit1 = vi.fn();
    const digit2 = vi.fn();
    const unregisterDigit1 = service.register('ctrl+Digit1', digit1);
    service.register('ctrl+Digit2', digit2);

    unregisterDigit1();
    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit1' }));
    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit2' }));

    expect(digit1).not.toHaveBeenCalled();
    expect(digit2).toHaveBeenCalledOnce();
  });

  it('should not affect other bindings when a new one is registered', () => {
    const digit1 = vi.fn();
    const digit2 = vi.fn();
    service.register('ctrl+Digit1', digit1);
    service.register('ctrl+Digit2', digit2);

    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit1' }));
    service.handleKeydownEvent(keydown({ ctrlKey: true, code: 'Digit2' }));

    expect(digit1).toHaveBeenCalledOnce();
    expect(digit2).toHaveBeenCalledOnce();
  });
});
