import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { GoogleAdSense } from '../../src/components/GoogleAdSense';
import { ADSENSE_CONFIG, pushAdSense } from '../../src/services/adsenseService';

describe('Google AdSense Service & Component (Browser)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.adsbygoogle = [];
  });

  it('1. Holds valid Google AdSense client/publisher ID', () => {
    expect(ADSENSE_CONFIG.publisherId).toBe('ca-pub-5486823026870276');
    expect(ADSENSE_CONFIG.scriptUrl).toContain('ca-pub-5486823026870276');
  });

  it('2. Pushes ad call to window.adsbygoogle array', () => {
    window.adsbygoogle = [];
    pushAdSense();
    expect(window.adsbygoogle.length).toBe(1);
  });

  it('3. Renders ins element with client ID and responsive attributes', () => {
    const { container } = render(<GoogleAdSense slot="1234567890" />);
    const ins = container.querySelector('ins.adsbygoogle');

    expect(ins).not.toBeNull();
    expect(ins?.getAttribute('data-ad-client')).toBe('ca-pub-5486823026870276');
    expect(ins?.getAttribute('data-ad-slot')).toBe('1234567890');
    expect(ins?.getAttribute('data-full-width-responsive')).toBe('true');
  });
});
