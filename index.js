require('dotenv').config()

const fs = require('fs');
const path = require('path');

const { WebClient } = require('@slack/web-api');

const { SLACK_TOKEN: token, CHANNEL_ID: channel } = process.env;

const web = new WebClient(token);

// File Details
const filename = 'SLA-Slack-from-Salesforce-logo-inverse.png';
const filePath = path.join(__dirname, filename);
const length = fs.statSync(filePath).size;

(async () => {
  // See: https://api.slack.com/methods/files.getUploadURLExternal
  const {upload_url, file_id} = await web.files.getUploadURLExternal({
    length,
    filename,
  });

  // Read the file from the file system
  const fileBuffer = fs.readFileSync(filePath);

  // Upload the file to the provided upload_url
  await fetch(upload_url, {
    method: 'POST',
    body: fileBuffer,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileBuffer.length,
    },
  });

  // See: https://api.slack.com/methods/files.completeUploadExternal
  const {files: [{url_private}]} = await web.files.completeUploadExternal({files: [{id: file_id}]});

  // UPDATE THIS
  const WAIT_TWO_SECONDS = false;

  if(WAIT_TWO_SECONDS) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }

  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({
    username: 'Bot',
    channel,
    text: filename,
    blocks: [
      {
        type: 'image',
        title: { type: 'plain_text', text: filename },
        slack_file: {
          url: url_private,
        },
        alt_text: 'Slack Logo',
      },
    ],
  });

  // `res` contains information about the posted message
  console.log('res', res);
})();
