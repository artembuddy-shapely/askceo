/**
 * AskCEO — Google Apps Script backend
 *
 * Setup:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Paste this entire file, replacing any existing code
 *  3. Click Deploy → New deployment → Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the deployment URL and paste it into index.html as APPS_SCRIPT_URL
 *
 * The sheet will receive columns: Timestamp | Name | Question
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write header row on first submission if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Question']);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.name     || 'Anonymous',
      data.question || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health-check — visiting the URL in a browser should return "OK"
function doGet() {
  return ContentService
    .createTextOutput('AskCEO is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
