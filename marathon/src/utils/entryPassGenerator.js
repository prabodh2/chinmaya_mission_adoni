import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

/**
 * Utility to download or print the official Entry Pass with crisp, pixel-perfect rendering
 */

let isGenerating = false;

/**
 * Download the Entry Pass element as a high-resolution PNG image
 * @param {HTMLElement | string} elementOrId
 * @param {string} registrationId
 */
export const downloadEntryPassAsImage = async (elementOrId, registrationId = 'Entry_Pass') => {
  if (isGenerating) {
    console.warn('Entry pass generation already in progress...');
    return false;
  }
  isGenerating = true;

  try {
    const element =
      typeof elementOrId === 'string'
        ? document.getElementById(elementOrId)
        : elementOrId;

    if (!element) {
      throw new Error('Entry Pass element not found');
    }

    let dataUrl = null;

    // Primary modern approach: html-to-image (preserves full CSS, flex, inline SVG & images perfectly)
    try {
      dataUrl = await toPng(element, {
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
        quality: 1,
        style: {
          transform: 'none',
          margin: '0 auto',
        },
      });
    } catch (toImageError) {
      console.warn('html-to-image failed, falling back to html2canvas:', toImageError);
    }

    // Fallback approach: html2canvas with explicit dimensions
    if (!dataUrl) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });
      dataUrl = canvas.toDataURL('image/png');
    }

    if (!dataUrl) {
      throw new Error('Could not generate pass image data');
    }

    const cleanId = String(registrationId || 'Entry_Pass').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanId}_Entry_Pass.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } finally {
    isGenerating = false;
  }
};

/**
 * Print the Entry Pass via browser native print dialog with page isolation
 */
export const printEntryPass = () => {
  window.print();
};
