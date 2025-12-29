import { getProgram } from './program'
import { GLOBAL_STATE_PDA } from '../constants/addresses'

export const fetchGlobalState = async (
  connection: any,
  wallet?: any
) => {
  try {
    const program = getProgram(connection, wallet)
    return await program.account.globalState.fetch(GLOBAL_STATE_PDA)
  } catch {
    return null
  }
}
