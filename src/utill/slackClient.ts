import { App } from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'

async function getEmailAdressFromSlack(
  app: App<StringIndexed>,
  user: string
): Promise<string> {
  const resp = await app.client.users.info({ user: user })
  const email = resp.user?.profile?.email!
  return email
}

export { getEmailAdressFromSlack }
