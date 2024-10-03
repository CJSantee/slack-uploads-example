# Slack Uploading Images

## Note

I've noticed that when uploading an image to Slack using the [Node Slack SDK](https://tools.slack.dev/node-slack-sdk/) and the instructions outlined in "[working with files](https://api.slack.com/messaging/files#uploading_files)," the image uploaded is not immediately available for use within a message.

I've demonstrated this with a simple example where a two-second delay can be added after the upload of an image is confirmed and a message with the image is posted. I've discovered that with this delay postMessage functions as expected but without the delay postMessage fails due to a invalid slack file.

## Running the example

1. Create a .env file.

    ```
    SLACK_TOKEN=<YOUR_SLACK_BOT_TOKEN>
    CHANNEL_ID=<CHANNEL_ID_TO_SEND_IMAGE_IN>
    ```

2. Run `npm install` to install dependencies.

3. Update the `WAIT_TWO_SECONDS` variable within [index.js](https://github.com/CJSantee/slack-uploads-example/blob/main/index.js#L41)

4. Run `node index.js` to run the example.

5. Repeat steps (3-4) and notice the difference.

## Discovery

### When `WAIT_TWO_SECONDS` is `false`
```js
/slack-uploads-example/node_modules/@slack/web-api/dist/errors.js:65
    const error = errorWithCode(new Error(`An API error occurred: ${result.error}`), ErrorCode.PlatformError);
                                ^

Error: An API error occurred: invalid_blocks
    at platformErrorFromResult (/slack-uploads-example/node_modules/@slack/web-api/dist/errors.js:65:33)
    at WebClient.<anonymous> (/slack-uploads-example/node_modules/@slack/web-api/dist/WebClient.js:205:60)
    at Generator.next (<anonymous>)
    at fulfilled (/slack-uploads-example/node_modules/@slack/web-api/dist/WebClient.js:28:58)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  code: 'slack_webapi_platform_error',
  data: {
    ok: false,
    error: 'invalid_blocks',
    errors: [
      'invalid slack file [json-pointer:/blocks/0/slack_file.url/slack_file]'
    ],
    response_metadata: {
      messages: [
        '[ERROR] invalid slack file [json-pointer:/blocks/0/slack_file.url/slack_file]'
      ],
      scopes: [
        'channels:history',
        'channels:join',
        'channels:manage',
        'channels:read',
        'chat:write',
        'chat:write.customize',
        'chat:write.public',
        'commands',
        'files:read',
        'files:write',
        'reactions:write',
        'users:read',
        'users.profile:read',
        'reactions:read'
      ],
      acceptedScopes: [ 'chat:write' ]
    }
  }
}
```

### When `WAIT_TWO_SECONDS` is `true`
```js
res {
  ok: true,
  channel: '<CHANNEL_ID>',
  ts: '<ts>',
  message: {
    subtype: 'bot_message',
    text: 'SLA-Slack-from-Salesforce-logo-inverse.png',
    username: 'Bot',
    type: 'message',
    ts: '<ts>',
    bot_id: '<BOT_ID>',
    app_id: '<APP_ID>',
    blocks: [ [Object] ]
  },
  response_metadata: {
    scopes: [
      'channels:history',
      'channels:join',
      'channels:manage',
      'channels:read',
      'chat:write',
      'chat:write.customize',
      'chat:write.public',
      'commands',
      'files:read',
      'files:write',
      'reactions:write',
      'users:read',
      'users.profile:read',
      'reactions:read'
    ],
    acceptedScopes: [ 'chat:write' ]
  }
}
```