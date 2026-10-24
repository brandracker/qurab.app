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

// Mock WebSocket for JSDOM
class MockWebSocket {
  url: string;
  readyState = 1;
  onopen: any = null;
  onmessage: any = null;
  onerror: any = null;
  onclose: any = null;
  constructor(url: string) {
    this.url = url;
    setTimeout(() => { if (this.onopen) this.onopen({} as any); }, 0);
  }
  send = vi.fn();
  close = vi.fn();
}
if (!globalThis.WebSocket) {
  globalThis.WebSocket = MockWebSocket as any;
}

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
    if (urlStr.includes('/matches/received')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          count: 0,
          candidates: []
        })
      };
    }
    if (urlStr.includes('/matches/mutual')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          count: 0,
          matches: []
        })
      };
    }
    if (urlStr.includes('/matches/activity')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          sentLikes: [],
          passed: [],
          blocked: []
        })
      };
    }
    if (urlStr.includes('/matches/hub')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          received: [],
          mutual: [],
          sentLikes: [],
          passed: [],
          blocked: []
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
    if (urlStr.includes('/users/detect-location')) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          source: 'mock',
          city: 'London',
          country: 'GB',
          latitude: 51.5074,
          longitude: -0.1278
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

