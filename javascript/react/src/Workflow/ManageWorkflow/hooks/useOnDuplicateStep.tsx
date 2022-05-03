/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, GraphManager } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import {
	useCreateTableName,
	useFormattedColumnArgWithCount,
} from '../../../common/index.js'
import { StepsType } from '../../../index.js'

export function useOnDuplicateStep(
	type: StepsType,
	graph?: GraphManager,
	table?: ColumnTable,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(graph)
	const formattedColumnArgs = useFormattedColumnArgWithCount()

	return useCallback(
		(_step: Step) => {
			const tableName =
				type === StepsType.Table ? createTableName(_step.id) : _step.id

			const outputTable = graph ? graph.latest(_step.id)?.table : table
			const formattedArgs = formattedColumnArgs(
				_step,
				outputTable?.columnNames() ?? [],
			)
			const newStep = {
				..._step,
				args: formattedArgs,
				inputs: { source: { node: _step.id } },
			}
			onSave?.(newStep)
		},
		[onSave, createTableName, formattedColumnArgs, type, graph, table],
	)
}
