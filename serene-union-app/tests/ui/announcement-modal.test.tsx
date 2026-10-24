import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnnouncementModal } from '../../src/components/AnnouncementModal';

describe('UI: AnnouncementModal Dynamic Broadcast Component', () => {
  it('1. Renders title and message when isOpen is true', () => {
    const handleClose = vi.fn();
    render(
      <AnnouncementModal
        isOpen={true}
        title="Special Eid Barakah Update"
        message="Assalam-o-Alaikum! We have unlocked unlimited profile views for all members this weekend."
        onClose={handleClose}
      />
    );

    expect(screen.getByText('Special Eid Barakah Update')).toBeDefined();
    expect(screen.getByText(/We have unlocked unlimited profile views/i)).toBeDefined();
    expect(screen.getByText(/Alhamdulillah, Understood/i)).toBeDefined();
  });

  it('2. Clicking action button triggers onAction and onClose', () => {
    const handleClose = vi.fn();
    const handleAction = vi.fn();
    render(
      <AnnouncementModal
        isOpen={true}
        title="App Update Available"
        message="Please enjoy faster Discover feeds."
        actionText="Got it!"
        onAction={handleAction}
        onClose={handleClose}
      />
    );

    const actionBtn = screen.getByText('Got it!');
    fireEvent.click(actionBtn);

    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('3. Renders nothing when isOpen is false', () => {
    const { container } = render(
      <AnnouncementModal
        isOpen={false}
        title="Hidden Announcement"
        message="Should not be visible"
        onClose={vi.fn()}
      />
    );

    expect(container.innerHTML).toBe('');
  });
});
