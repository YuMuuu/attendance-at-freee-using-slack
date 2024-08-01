import { getAllEmployees } from './freeeHRApiClient'

type email = string
type employeeId = number

const employeeIdMap = new Map<email, employeeId>()

//memo: refresh中にgetしてしまう事が多発するならlock機構を作る
function get(email: email): employeeId | undefined {
  return employeeIdMap.get(email)
}

async function refresh(): Promise<void> {
  employeeIdMap.clear()
  await fetchEmployeesRecursively(0)
}

async function fetchEmployeesRecursively(offset: number): Promise<void> {
  const result = await getAllEmployees(offset)

  if (result.length > 0) {
    result.forEach((r) => employeeIdMap.set(r.email, r.employeeId))

    // 次のオフセットで再帰的に関数を呼び出す
    await fetchEmployeesRecursively(offset + 1)
  }
}

export { get, refresh }
