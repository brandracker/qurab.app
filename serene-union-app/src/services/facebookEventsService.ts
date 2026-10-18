import { registerPlugin, Capacitor } from '@capacitor/core';

interface FacebookEventsPluginInterface {
  logEvent(options: { eventName: string; parameters?: Record<string, any> }): Promise<{ success: boolean }>;
  logPurchase(options: { amount: number; currency: string; parameters?: Record<string, any> }): Promise<{ success: boolean }>;
  activateApp?(): Promise<{ success: boolean }>;
}

const FacebookEventsPlugin = registerPlugin<FacebookEventsPluginInterface>('FacebookEventsPlugin');

class FacebookEventsService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Activate app and log initial session
   */
  async logAppLaunch(): Promise<void> {
    if (this.isNative) {
      try {
        if (FacebookEventsPlugin.activateApp) {
          await FacebookEventsPlugin.activateApp();
        }
      } catch (err) {
        console.warn('[FacebookEvents] activateApp error:', err);
      }
    }
    await this.logEvent('fb_mobile_activate_app', { app_name: 'Qurb' });
  }

  /**
   * Log any generic or custom Meta App Event
   */
  async logEvent(eventName: string, parameters?: Record<string, any>): Promise<void> {
    if (this.isNative) {
      try {
        await FacebookEventsPlugin.logEvent({ eventName, parameters });
      } catch (err) {
        console.warn(`[FacebookEvents] Failed to log event ${eventName}:`, err);
      }
    } else {
      // In browser/dev mode, log to console for debugging
      console.log(`[FacebookEvents Mock] ${eventName}:`, parameters);
    }
  }

  /**
   * 1. Complete Registration (Sign Up / Onboarding Finish)
   * Triggered when a member registers via Email, Phone, or Google
   */
  async logCompleteRegistration(method: string = 'Email'): Promise<void> {
    await this.logEvent('fb_mobile_complete_registration', {
      fb_registration_method: method,
      app_name: 'Qurb'
    });
  }

  /**
   * 2. Search / Discovery
   * Triggered when a member filters or searches candidate profiles
   */
  async logSearch(query: string = '', contentType: string = 'candidate_profiles'): Promise<void> {
    await this.logEvent('fb_mobile_search', {
      fb_search_string: query,
      fb_content_type: contentType
    });
  }

  /**
   * 3. View Content
   * Triggered when candidate biodata is viewed
   */
  async logViewContent(contentId: string, candidateName: string = ''): Promise<void> {
    await this.logEvent('fb_mobile_content_view', {
      fb_content_id: contentId,
      fb_content_type: 'matrimonial_candidate',
      candidate_name: candidateName
    });
  }

  /**
   * 4. Initiate Checkout
   * Triggered when user opens the Stripe or In-App purchase sheet
   */
  async logInitiateCheckout(productId: string, amount: number = 0, currency: string = 'USD'): Promise<void> {
    await this.logEvent('fb_mobile_initiated_checkout', {
      fb_content_id: productId,
      fb_content_type: 'subscription_or_credits',
      fb_num_items: 1,
      value: amount,
      currency
    });
  }

  /**
   * 5. Subscribe
   * Triggered when member activates Barakah VIP Club
   */
  async logSubscribe(tier: string = 'barakah_vip', price: number = 29.99, currency: string = 'USD'): Promise<void> {
    await this.logEvent('Subscribe', {
      fb_content_id: tier,
      tier_name: 'Barakah VIP',
      value: price,
      currency
    });
  }

  /**
   * 6. Purchase
   * Triggered when Google Play or Stripe transaction completes successfully
   */
  async logPurchase(amount: number, currency: string = 'USD', productId: string = ''): Promise<void> {
    if (this.isNative) {
      try {
        await FacebookEventsPlugin.logPurchase({
          amount,
          currency,
          parameters: { fb_content_id: productId }
        });
      } catch (err) {
        console.warn('[FacebookEvents] Failed to log purchase:', err);
      }
    } else {
      console.log(`[FacebookEvents Mock Purchase] ${amount} ${currency} for ${productId}`);
    }
  }

  /**
   * 7. Spend Credits (e.g. Sent Direct Salam / Complimentary compliment)
   */
  async logSpendCredits(creditsAmount: number = 1, purpose: string = 'direct_salam'): Promise<void> {
    await this.logEvent('fb_mobile_spent_credits', {
      fb_value_to_sum: creditsAmount,
      fb_content_type: purpose
    });
  }

  /**
   * 8. Contact / Direct Salam
   * Triggered when user sends a Direct Salam to a candidate
   */
  async logContact(candidateId: string): Promise<void> {
    await this.logEvent('Contact', {
      fb_content_id: candidateId,
      method: 'direct_salam'
    });
  }
}

export const facebookEventsService = new FacebookEventsService();
