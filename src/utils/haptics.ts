/**
 * EXPDOC Studio Haptic Feedback Engine
 * Ultra-responsive tactile feedback powered by the Web Vibration API.
 * Automatically gracefully degrades on desktop/unsupported browsers.
 */

class HapticsEngine {
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('expdoc_haptics');
      this.enabled = saved !== null ? saved === 'true' : true;
    }
  }

  /**
   * Check if the device / browser supports the Web Vibration API
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 
           typeof navigator !== 'undefined' && 
           'vibrate' in navigator &&
           typeof navigator.vibrate === 'function';
  }

  /**
   * Check whether haptic feedback is currently enabled by user preference
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Toggle or set haptic feedback enabled state
   */
  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (typeof window !== 'undefined') {
      localStorage.setItem('expdoc_haptics', enable ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('expdoc-haptics-change', { detail: enable }));
    }
    if (enable) {
      this.selection();
    }
  }

  /**
   * Raw vibration dispatcher with safe guards
   */
  public vibrate(pattern: number | number[]): boolean {
    if (!this.enabled || !this.isSupported()) return false;
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  /**
   * Ultra-light 8ms tick - ideal for tabs, micro-interactions, selection changes
   */
  public selection() {
    this.vibrate(8);
  }

  /**
   * Light 12ms tap - ideal for toolbar buttons, formatting toggles, checkboxes
   */
  public light() {
    this.vibrate(12);
  }

  /**
   * Medium 24ms bump - ideal for tool cards, modal opens, presets, upload triggers
   */
  public medium() {
    this.vibrate(24);
  }

  /**
   * Heavy 45ms impact - ideal for Add Page, Delete Page, Clear, Compile triggers
   */
  public heavy() {
    this.vibrate(45);
  }

  /**
   * Success two-pulse pattern [15ms, 50ms pause, 25ms] - PDF build done, download ready
   */
  public success() {
    this.vibrate([15, 50, 25]);
  }

  /**
   * Warning double bump [30ms, 60ms pause, 30ms] - confirmations, destructive actions
   */
  public warning() {
    this.vibrate([30, 60, 30]);
  }

  /**
   * Error triple buzz [40ms, 80ms, 40ms, 80ms, 40ms] - failed operations, blocked inputs
   */
  public error() {
    this.vibrate([40, 80, 40, 80, 40]);
  }

  /**
   * Tactile drag tick - when picking up or dropping items in sortable lists
   */
  public drag() {
    this.vibrate(15);
  }

  /**
   * Mode switch pulse - Light/Dark toggle, Web/App OS switch
   */
  public toggle() {
    this.vibrate(18);
  }
}

export const haptics = new HapticsEngine();
export default haptics;
