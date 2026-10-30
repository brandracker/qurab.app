import { describe, it, expect, vi } from 'vitest';
import { backNavigationService } from '../../src/services/backNavigationService';

describe('Chat Back Navigation and Hardware Interception', () => {
  it('correctly intercepts back navigation when inside active chat room', () => {
    let activeConvId: string | null = 'usr_user1_usr_user2';
    const onActiveConvChange = vi.fn((id: string | null) => {
      activeConvId = id;
    });

    // Simulate ChatScreen registering with backNavigationService
    const unregister = backNavigationService.register(() => {
      if (activeConvId) {
        activeConvId = null;
        onActiveConvChange(null);
        return true; // Consumed! Stays on chat tab menu
      }
      return false; // Delegated
    });

    // 1. First back press (user is inside chat room)
    const consumedFirst = backNavigationService.handleBack();
    expect(consumedFirst).toBe(true);
    expect(activeConvId).toBeNull();
    expect(onActiveConvChange).toHaveBeenCalledWith(null);

    // 2. Second back press (user is now on Chat conversation list / tabs)
    const consumedSecond = backNavigationService.handleBack();
    expect(consumedSecond).toBe(false); // Not consumed, delegating to App.tsx to go to Discover

    unregister();
  });

  it('closes nested modal first before closing active chat room', () => {
    let activeConvId: string | null = 'usr_user1_usr_user2';
    let selectedProfile: any = { id: 'usr_partner', fullName: 'Nazm e-Dil' };

    const unregister = backNavigationService.register(() => {
      if (selectedProfile) {
        selectedProfile = null;
        return true; // Consumed: closed profile modal
      }
      if (activeConvId) {
        activeConvId = null;
        return true; // Consumed: closed chat room
      }
      return false;
    });

    // Back press 1: closes profile modal
    expect(backNavigationService.handleBack()).toBe(true);
    expect(selectedProfile).toBeNull();
    expect(activeConvId).toBe('usr_user1_usr_user2'); // Chat room still active

    // Back press 2: closes chat room, returning to chat list
    expect(backNavigationService.handleBack()).toBe(true);
    expect(activeConvId).toBeNull();

    // Back press 3: delegates to parent
    expect(backNavigationService.handleBack()).toBe(false);

    unregister();
  });
});
