import { ClockInStatus } from './ClockInStatus'

type email = string
type employeeId = number

//todo: 従業員一覧を取得し、email二関連する従業員IDを取得するmapを作成する
//memo: 入社/退社した人がいた場合に同対応する？再取得actionを作るか一定期間で再取得するようにする？
const employeeIdMap = new Map<email, employeeId>()

const companyId = 111 //固定値なのでenvで取る
async function registerClockIn(
  employeeId: employeeId,
  clockInStatus: ClockInStatus
): Promise<void> {
  const req = await fetch(
    `https://api.freee.co.jp/api/v1/employees/${employeeId}/time_clocks`,
    {
      body: JSON.stringify({ company_id: companyId, type: clockInStatus }),
    }
  )

  const resp = await req
  if (!resp.ok) {
    //resp.body.errors[0].messages をエラー内容にして変える
    throw new Error('エラーが発生しました')
  }
}
