import { App } from '@slack/bolt'
import * as employeeIdMapper from './utill/employeeIdMapper'
import { getEmailAdressFromSlack } from './utill/slackClient'
import * as freeeApiClient from './utill/freeeHRApiClient'

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
      try {
        const user = message.user!
        const email = await getEmailAdressFromSlack(app, user)
        const employeeId = employeeIdMapper.get(email)
        await freeeApiClient.registerClockIn(employeeId!, 'clock_in')
        await say(`リモートワーク出勤を打刻しました`)
      } catch (error) {
        console.log(JSON.stringify(error))
        await say(JSON.stringify(error)) //どうせ復帰できないので適当にエラーを出力する
      }
    }
  }
})

app.message(':freee_remote_out:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      try {
        const user = message.user!
        const email = await getEmailAdressFromSlack(app, user)
        const employeeId = employeeIdMapper.get(email)
        await freeeApiClient.registerClockIn(employeeId!, 'clock_out')
      } catch (error) {
        console.log(JSON.stringify(error))
        await say(JSON.stringify(error)) //どうせ復帰できないので適当にエラーを出力する
      }
    }
  }
})

app.message(':freee_refresh_employees:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      try {
        await employeeIdMapper.refresh
        await say('従業員情報をリロードしました')
      } catch (error) {
        console.log(JSON.stringify(error))
        await say(JSON.stringify(error)) //どうせ復帰できないので適当にエラーを出力する
      }
    }
  }
})

app.message(':freee_bot_ping:', async ({ message, say }) => {
  if (message.channel === LISTEN_CHANNNEL_ID) {
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`pong!, <@${message.user}>`)
    }
  }
})
;(async () => {
  await employeeIdMapper.refresh() //起動時に全従業委員の情報を取得する
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
