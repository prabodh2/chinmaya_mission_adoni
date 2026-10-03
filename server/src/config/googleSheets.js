import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Synchronizes a registration record with Google Sheets.
 * If credentials are missing or API fails, returns status: 'failed' with error message
 * without throwing, so MongoDB save is NEVER lost.
 */
export const syncRegistrationToGoogleSheets = async (registration) => {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

  if (!sheetId || !clientEmail || !privateKey || sheetId === 'demo_sheets_id') {
    return {
      status: 'pending',
      syncedAt: null,
      error: 'Google Sheets credentials not configured. Registration saved in MongoDB.',
    };
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
      [
        registration.registrationId,
        registration.fullName,
        registration.dateOfBirth ? new Date(registration.dateOfBirth).toISOString().split('T')[0] : 'N/A',
        registration.isStudent ? 'YES' : 'NO',
        registration.institutionName || 'N/A',
        registration.contactNumber,
        registration.tShirtSize,
        registration.registrationType,
        new Date(registration.createdAt || Date.now()).toISOString(),
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Registrations!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return {
      status: 'success',
      syncedAt: new Date(),
      error: null,
    };
  } catch (err) {
    console.error('[Google Sheets Sync Error]:', err.message);
    return {
      status: 'failed',
      syncedAt: null,
      error: err.message,
    };
  }
};
