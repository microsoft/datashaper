/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnArgs, Step } from '@data-wrangling-components/core'
import {
	isInputColumnStep,
	isNumericInputStep,
} from '@data-wrangling-components/core'
import { TableColumnDropdown } from '@data-wrangling-components/react-controls'
import { useTableColumnOptions } from '@data-wrangling-components/react-hooks'
import type { StepComponentProps } from '@data-wrangling-components/react-verbs'
import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from '@data-wrangling-components/react-verbs'
import { columnTypes, DataType } from '@essex/arquero'
import { NodeInput } from '@essex/dataflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import type { HOCFunction } from './types.js'
/**
 * Higher order component generator to wrap a Step in the input column dropdown.
 * @param label - optional label to use for the dropdown instead of the default.
 * @returns
 */
export function withInputColumnDropdown<T extends InputColumnArgs>(
	label?: string,
): HOCFunction<StepComponentProps<T>> {
	return Component => {
		const WithInputColumnDropdown: React.FC<StepComponentProps<T>> = props => {
			const { step, store, onChange, input, table } = props
			const handleColumnChange = useHandleDropdownChange(
				step,
				(s, val) => (s.args.column = val as string),
				onChange,
			)

			// TODO: detailed types/stats should be an option on table load,
			// which will then be passed around with the container and thereby cached
			// useLoadTable should return a TableContainer
			const tbl = useLoadTable(
				input || step.input[NodeInput.Source]?.node,
				table,
				store,
			)

			const filter = useColumnFilter(step, tbl)
			const options = useTableColumnOptions(tbl, filter)

			if (!isInputColumnStep(step)) {
				return <Component {...props} />
			}
			return (
				<Container className="with-input-column-dropdown">
					<LeftAlignedRow>
						<TableColumnDropdown
							required
							options={options}
							label={label || `Column to ${step.verb}`}
							selectedKey={(step.args as InputColumnArgs).column}
							onChange={handleColumnChange}
						/>
					</LeftAlignedRow>
					<Component {...props} />
				</Container>
			)
		}
		return memo(WithInputColumnDropdown)
	}
}

function useColumnFilter(step: Step<unknown>, table?: ColumnTable) {
	const typeMap = useMemo(() => {
		if (table) {
			return columnTypes(table)
		}
		return {}
	}, [table])
	return useCallback(
		(name: string) => {
			return isNumericInputStep(step) ? typeMap[name] === DataType.Number : true
		},
		[typeMap, step],
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
