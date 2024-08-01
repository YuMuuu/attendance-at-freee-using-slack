import { App } from '@slack/bolt'
import { get, refresh } from './utill/employeeIdMapper'
import { getEmailAdressFromSlack } from './utill/slackClient'
import { registerClockIn } from './utill/freeeHRApiClient'

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
      const user = message.user!
      // await say(`物理出勤を打刻しました`)
      await say(`物理出勤の打刻は現在対応していません`)
    }
  }
})

app.message(':freee_buturi_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      // await say(`物理退勤を打刻しました`)
      await say(`物理退勤の打刻は現在対応していません`)
    }
  }
})

app.message(':freee_remote_in:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      const user = message.user!
      const email = await getEmailAdressFromSlack(app, user)
      const employeeId = get(email)
      const resp = await registerClockIn(employeeId!, 'clock_in')
        .then((i) => {
          say(`リモートワーク出勤を打刻しました`)
        })
        .catch((error) => {
          say(error as string)
        })
      await resp
    }
  }
})

app.message(':freee_remote_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      const user = message.user!
      const email = await getEmailAdressFromSlack(app, user)
      const employeeId = get(email)
      const resp = await registerClockIn(employeeId!, 'clock_out')
        .then((i) => {
          say(`リモートワーク退勤を打刻しました`)
        })
        .catch((error) => {
          say(error as string)
        })
      await resp
    }
  }
})

app.message(':freee_refresh_employees:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await fetchEmployeesRecursively(0)
      await say('従業員情報をリロードしました')
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
  await refresh()
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
function fetchEmployeesRecursively(arg0: number) {
  throw new Error('Function not implemented.')
}
