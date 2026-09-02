import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotificationsScreen } from '../../src/screens/NotificationsScreen';
import { notificationService } from '../../src/services/notificationService';

describe('UI & Button Interactions: Notifications Center', () => {
  beforeEach(() => {
    localStorage.clear();
    notificationService.clearAll();
  });

  it('1. Renders notifications list and category filter buttons', () => {
    notificationService.addNotification({
      type: 'match',
      title: 'Connected with Maryam 🎉',
      message: 'You have a mutual match!',
      actionLabel: 'Open Chat',
      targetId: 'conv_usr1_usr2'
    });

    const handleBack = vi.fn();
    const handleChat = vi.fn();

    render(
      <NotificationsScreen
        isOpen={true}
        onBack={handleBack}
        onNavigateToChat={handleChat}
      />
    );

    // Verify Title
    expect(screen.getByText(/Notifications/i)).toBeDefined();

    // Verify Notification Card
    expect(screen.getByText(/Connected with Maryam/i)).toBeDefined();

    // Category Buttons
    expect(screen.getByText(/^All$/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Interests & Salams/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Mutual Matches/i })).toBeDefined();
  });

  it('2. Clicking match notification routes directly to chat screen', () => {
    notificationService.addNotification({
      type: 'match',
      title: 'Connected with Sarah 🎉',
      message: 'Mutual interest confirmed',
      actionLabel: 'Open Chat',
      targetId: 'conv_123_456'
    });

    const handleBack = vi.fn();
    const handleChat = vi.fn();

    render(
      <NotificationsScreen
        isOpen={true}
        onBack={handleBack}
        onNavigateToChat={handleChat}
      />
    );

    const notifCard = screen.getByText(/Connected with Sarah/i);
    fireEvent.click(notifCard);

    expect(handleChat).toHaveBeenCalledWith('conv_123_456');
    expect(handleBack).toHaveBeenCalled();
  });
});
