const token_url = 'https://accounts.secure.freee.co.jp/public_api/token'
const redirect_uri = process.env.FREEE_ENCODE_CALLBACK_URL!
const client_id = process.env.FREEE_CLIENT_ID!
const client_secret = process.env.FREEE_CLIENT_SECRET!
let code = '取得した認可コード'
let access_token: string | null = null
let refresh_token: string | null = null
let lastTokenTime: number | null = null
const tokenExpiryTime = 6 * 60 * 60 * 1000 // 6時間

async function getAccessToken(): Promise<string> {
  if (
    !access_token ||
    (lastTokenTime && Date.now() - lastTokenTime > tokenExpiryTime)
  ) {
    if (!lastTokenTime) {
      await getInitAccessToken()
    } else {
      await getAccessTokenUsingRefreshToken()
    }
  }
  return access_token!
}

async function getInitAccessToken() {
  const authFormData = new FormData()
  authFormData.append('grant_type', 'authorization_code')
  authFormData.append('redirect_uri', redirect_uri)
  authFormData.append('client_id', client_id)
  authFormData.append('client_secret', client_secret)
  authFormData.append('code', code)

  const authReq = fetch(token_url, {
    method: 'POST',
    body: authFormData,
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  const authResp = await authReq
  const json = await authResp.json()
  access_token = json.access_token
  refresh_token = json.refresh_token
}

//リフレッシュトークンを用いてアクセストークンを取得する。
async function getAccessTokenUsingRefreshToken() {
  const authFormData = new FormData()
  authFormData.append('grant_type', 'authorization_code')
  authFormData.append('redirect_uri', redirect_uri)
  authFormData.append('client_id', client_id)
  authFormData.append('client_secret', client_secret)
  authFormData.append('refresh_token', refresh_token!)

  const authReq = fetch(token_url, {
    method: 'POST',
    body: authFormData,
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  const authResp = await authReq
  const json = await authResp.json()
  access_token = json.access_token
  refresh_token = json.refresh_token
}

export { getAccessToken }
