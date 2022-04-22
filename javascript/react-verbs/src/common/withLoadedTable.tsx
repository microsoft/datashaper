/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepComponentProps } from '../types.js'
import { useLoadTable } from './hooks.js'
import { NodeInput } from '@essex/dataflow'
import type React from 'react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function withLoadedTable<T>(
	StepComponent: React.ComponentType<
		StepComponentProps<T> & {
			dataTable: ColumnTable | undefined
		}
	>,
) {
	return function LoadedTable(props: StepComponentProps<T>) {
		const { step, table, store, input } = props
		const dataTable = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)
		return <StepComponent {...props} dataTable={dataTable} />
	}
}
