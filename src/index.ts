import { App } from '@slack/bolt'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

const LISTEN_CHANNNEL_ID = process.env.SLACK_LISTEN_CHANNEL_ID!

app.use(async ({ next }) => {
  await next()
})

app.message(':freee_buturi_in:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`物理出勤を打刻しました`)
    }
  }
})

app.message(':freee_buturi_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`物理退勤を打刻しました`)
    }
  }
})

app.message(':freee_remote_in:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`リモートワーク出勤を打刻しました`)
    }
  }
})

app.message(':freee_remote_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`リモートワーク退勤を打刻しました`)
    }
  }
})

app.message(':freee_kyukei_in:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`休憩入りを打刻しました`)
    }
  }
})

app.message(':freee_kyukei_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`休憩戻りを打刻しました`)
    }
  }
})

app.message('freee_bot_ping', async ({ message, say }) => {
  if (message.subtype === undefined || message.subtype === 'bot_message') {
    await say(`pong!, <@${message.user}>`)
  }
})
;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
