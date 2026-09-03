import { vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLMediaElement (Audio)
class MockAudio {
  src = '';
  currentTime = 0;
  duration = 45;
  paused = true;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  onended: (() => void) | null = null;
}
globalThis.Audio = MockAudio as any;

// Mock Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
