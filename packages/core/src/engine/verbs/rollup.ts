import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { Step, RollupArgs } from '../../types'
import { singleRollup } from '../util'

/**
 * Executes rollup.
 * @param step
 * @param store
 * @returns
 */

export async function rollup(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { field, operation, as } = args as RollupArgs
	const inputTable = await store.get(input)

	const expr = singleRollup(field, operation)

	const rArgs = {
		[`${as}`]: expr,
	}

	return inputTable.rollup(rArgs)
}
