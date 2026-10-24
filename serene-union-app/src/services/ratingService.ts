export const PLAY_STORE_PACKAGE = 'app.qurb.serene';
export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}`;
export const PLAY_STORE_MARKET_URI = `market://details?id=${PLAY_STORE_PACKAGE}`;

class RatingService {
  private hasRatedKey = 'qurb_has_rated_v1';
  private dismissedUntilKey = 'qurb_rating_dismissed_until_v1';
  private positiveActionKey = 'qurb_positive_action_count_v1';

  /**
   * Check if user has already permanently rated the app
   */
  hasRated(): boolean {
    try {
      return localStorage.getItem(this.hasRatedKey) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Check if rating prompt is in a cooldown/sleep period
   */
  isDismissed(): boolean {
    try {
      const untilStr = localStorage.getItem(this.dismissedUntilKey);
      if (!untilStr) return false;
      const until = parseInt(untilStr, 10);
      return Date.now() < until;
    } catch {
      return false;
    }
  }

  /**
   * Get total positive milestone actions (likes sent, mutual matches)
   */
  getPositiveActionCount(): number {
    try {
      const count = localStorage.getItem(this.positiveActionKey);
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Record a positive user action (e.g. like sent, profile completed)
   * Returns true if a rating milestone is reached and prompt is eligible
   */
  recordPositiveAction(): boolean {
    if (this.hasRated() || this.isDismissed()) return false;
    try {
      const current = this.getPositiveActionCount() + 1;
      localStorage.setItem(this.positiveActionKey, current.toString());
      // Milestone: Prompt after 3 positive actions
      return current >= 3;
    } catch {
      return false;
    }
  }

  /**
   * Evaluate whether rating modal should be shown
   */
  shouldShowRatingPrompt(): boolean {
    if (this.hasRated() || this.isDismissed()) return false;
    return this.getPositiveActionCount() >= 3;
  }

  /**
   * Dismiss prompt for N days (defaults to 14 days)
   */
  dismiss(days = 14): void {
    try {
      const until = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(this.dismissedUntilKey, until.toString());
    } catch {}
  }

  /**
   * Mark as permanently rated so user is never prompted again
   */
  markAsRated(): void {
    try {
      localStorage.setItem(this.hasRatedKey, 'true');
    } catch {}
  }

  /**
   * Open Google Play Store for 4-5 star reviews
   */
  openPlayStore(): void {
    this.markAsRated();
    try {
      if (typeof window !== 'undefined') {
        window.open(PLAY_STORE_MARKET_URI, '_system') || window.open(PLAY_STORE_URL, '_blank');
      }
    } catch {
      if (typeof window !== 'undefined') {
        window.open(PLAY_STORE_URL, '_blank');
      }
    }
  }

  /**
   * Submit private feedback for 1-3 star reviews (shields Play Store rating)
   */
  async submitPrivateFeedback(stars: number, feedback: string, userId?: string): Promise<boolean> {
    this.markAsRated();
    try {
      console.log(`[RatingService] Internal feedback captured (${stars} stars):`, { userId, feedback });
      localStorage.setItem(`qurb_internal_feedback_${Date.now()}`, JSON.stringify({ stars, feedback, userId }));
      return true;
    } catch {
      return true;
    }
  }
}

export const ratingService = new RatingService();
export default ratingService;
