import createClient from 'openapi-fetch'
import type { paths } from '../openapi/api-schema'
import { ClockInStatus } from './type'
import { getAccessToken } from './freerAuthorize'

interface EmailAndEmployeeId {
  email: string
  employeeId: number
}

const companyId: number = Number(process.env.FREEE_COMPANY_ID!)
const client = createClient<paths>({ baseUrl: 'https://api.freee.co.jp/hr' })

async function registerClockIn(
  employeeId: number,
  clockInStatus: ClockInStatus
): Promise<void> {
  const accessToken = await getAccessToken()

  const req = client.POST('/api/v1/employees/{employee_id}/time_clocks', {
    Headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      path: { employee_id: employeeId },
    },
    body: {
      company_id: companyId,
      type: clockInStatus,
    },
  })
  const resp = await req
  if (!resp.response.ok) {
    if (resp.error) {
      const messages = getErrorMessages(resp.error.errors)
      throw new Error(
        `status code: ${resp.error.status_code}, messages: ${messages}`
      )
    } else {
      throw new Error(`unknown error. api: time_clocks`)
    }
  }
}

async function getAllEmployees(offset: number): Promise<EmailAndEmployeeId[]> {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const accessToken = await getAccessToken()
  const req = client.GET('/api/v1/employees', {
    Headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      query: {
        company_id: companyId,
        limit: 100,
        offset: offset,
        year: year,
        month: month,
      },
    },
  })
  const resp = await req
  if (!resp.response.ok) {
    if (resp.error) {
      const messages = getErrorMessages(resp.error.errors)
      throw new Error(
        `status code: ${resp.error.status_code}, messages: ${messages}`
      )
    } else {
      throw new Error(`unknown error. api: get all employees`)
    }
  }
  const emailAndEmployeeId: EmailAndEmployeeId[] = resp!.data!.employees!.map(
    (p) => ({
      email: p.profile_rule!.email!,
      employeeId: p.profile_rule!.employee_id!,
    })
  )

  return emailAndEmployeeId
}

function getErrorMessages(
  errors?:
    | {
        type?: string
        messages?: string[]
      }[]
    | undefined
): string[] {
  if (errors) {
    errors.flatMap((e) => e.messages)
  }
  return []
}

export { registerClockIn, getAllEmployees }
