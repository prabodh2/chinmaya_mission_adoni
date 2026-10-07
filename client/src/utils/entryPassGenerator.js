import html2canvas from 'html2canvas';

/**
 * Utility to download or print the official Entry Pass
 */

/**
 * Download the Entry Pass element as a high-resolution PNG image
 * @param {HTMLElement | string} elementOrId
 * @param {string} registrationId
 */
export const downloadEntryPassAsImage = async (elementOrId, registrationId = 'Entry_Pass') => {
  const element =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!element) {
    throw new Error('Entry Pass element not found');
  }

  // Generate canvas with 3x scale for crisp high-DPI retina output
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
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
};

/**
 * Print the Entry Pass via browser native print dialog with page isolation
 */
export const printEntryPass = () => {
  window.print();
};
