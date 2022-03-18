/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@data-wrangling-components/dataflow-graph'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type {
	AggregateArgs,
	AggregateStep,
	TableContainer,
} from '../../types.js'
import { StepNode } from '../nodes.js'
import { singleExpression } from '../util/index.js'

/**
 * Executes an aggregate, which is an arquero groupby + rollup.
 * @param step
 * @param store
 * @returns
 */
export async function aggregate(
	{ input, output, args }: AggregateStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)
	return doAggregate(output, inputTable, args)
}

export class AggregateNode extends StepNode<AggregateArgs> {
	protected override compute(source: TableContainer): Maybe<TableContainer> {
		if (!this.config || !source.table) {
			return undefined
		}
		return doAggregate(this.id, source.table, this.config)
	}
}

function doAggregate(id: string, input: ColumnTable, config: AggregateArgs) {
	const { groupby, column, operation, to } = config
	const expr = singleExpression(column, operation)
	const rArgs = { [to]: expr }
	return container(id, input.groupby(groupby).rollup(rArgs))
}
