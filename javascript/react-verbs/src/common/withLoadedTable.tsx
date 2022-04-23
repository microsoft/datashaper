/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NodeInput } from '@essex/dataflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { StepComponentProps } from '../types.js'
import { useLoadTable } from './hooks.js'

export function withLoadedTable<T>(
	StepComponent: React.ComponentType<
		StepComponentProps<T> & {
			dataTable: ColumnTable | undefined
		}
	>,
) {
	return function LoadedTable(props: StepComponentProps<T>): JSX.Element {
		const { step, table, store, input } = props
		const dataTable = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)
		return <StepComponent {...props} dataTable={dataTable} />
	}
}
