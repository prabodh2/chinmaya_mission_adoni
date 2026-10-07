import html2canvas from 'html2canvas';

/**
 * Utility to download or print the official Entry Pass
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

    // Generate canvas with 2x scale for fast, crisp retina output
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${registrationId}_Entry_Pass.png`;
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
