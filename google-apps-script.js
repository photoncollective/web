const SHEET_ID    = '18K2lFVjYuaGZ5cicZ55lgei7KSjhi2l3QYbeyDUsquE';
const OWNER_EMAIL = 'hello@photoncollective.dev';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.name    || '',
      data.email   || '',
      data.firm    || '',
      data.topic   || '',
      data.message || ''
    ]);

    var body = 'New discovery call request\n\n'
      + 'Name:    ' + data.name + '\n'
      + 'Email:   ' + data.email + '\n'
      + 'Firm:    ' + data.firm + '\n'
      + 'Focus:   ' + data.topic + '\n'
      + (data.message ? '\nMessage:\n' + data.message : '');

    GmailApp.sendEmail(
      OWNER_EMAIL,
      'Discovery call request - ' + data.firm,
      body
    );

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
