/**
 * Global Hardware Back Navigation Manager for Android & Web
 * Allows modals, drawers, and overlay components to register LIFO handlers.
 * When the user taps the Android hardware back button or swipe-back gesture,
 * the top-most modal/handler intercepts the event and closes gracefully.
 */

type BackHandler = () => boolean; // return true if handled, false to delegate down

class BackNavigationService {
  private handlers: BackHandler[] = [];

  /**
   * Register a back button handler. Returns an unregister cleanup function.
   * Top-most (last registered) handlers execute first.
   */
  register(handler: BackHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  /**
   * Dispatches the back event down the stack.
   * Returns true if any handler consumed the event.
   */
  handleBack(): boolean {
    for (let i = this.handlers.length - 1; i >= 0; i--) {
      try {
        const handled = this.handlers[i]();
        if (handled) return true;
      } catch (err) {
        console.warn('[BackNav] Handler execution notice:', err);
      }
    }
    return false;
  }
}

export const backNavigationService = new BackNavigationService();
