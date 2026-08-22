/**
 * Web Share API and Clipboard utility
 */

export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export async function shareProduct(data: ShareData): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'failed' }> {
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  // Fallback to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(`${data.title}\n${data.url}`);
      return { success: true, method: 'clipboard' };
    }
  } catch (err) {
    // Clipboard failed
  }

  return { success: false, method: 'failed' };
}
