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

// Mock fetch to prevent tests from making live network requests
if (!globalThis.fetch || !(globalThis.fetch as any)._isMock) {
  const mockFetch = vi.fn().mockImplementation(async (url: any) => {
    const urlStr = String(url);
    if (urlStr.includes('/wallet/')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          wallet: {
            likesRemaining: 50,
            isVip: false,
            directSalams: 2,
            adsWatchedForSalam: 0,
            dailyMessagesQuota: 15
          }
        })
      };
    }
    if (urlStr.includes('/matches/')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          isMutual: false,
          conversationId: 'conv_mock_test'
        })
      };
    }
    return {
      ok: true,
      json: async () => ({ success: true })
    };
  });
  (mockFetch as any)._isMock = true;
  globalThis.fetch = mockFetch as any;
}

