/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnArgs, Step } from '@data-wrangling-components/core'
import {
	DataType,
	isInputColumnStep,
	isNumericInputStep,
	types,
} from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from './common/index.js'
import { ColumnOrValueComboBox, TableColumnDropdown } from './controls/index.js'
import { dropdownStyles } from './controls/styles.js'
import type { HOCFunction, StepComponentProps } from './types.js'
/**
 * Higher order component generator to wrap a Step in the input column dropdown.
 * @param label optional label to use for the dropdown instead of the default.
 * @returns
 */
export const withInputColumnDropdown = (
	label?: string,
): HOCFunction<StepComponentProps> => {
	return Component => {
		const WithInputColumnDropdown: React.FC<StepComponentProps> = props => {
			const { step, store, onChange, input, table } = props
			const handleColumnChange = useHandleDropdownChange(
				step,
				'args.column',
				onChange,
			)

			const handleComboBoxChange = useCallback(
				(_event, option, value) => {
					const update = cloneDeep(step)
					set(update, 'args.column', option ? option.key : value)
					onChange && onChange(update)
				},
				[step, onChange],
			)

			// TODO: detailed types/stats should be an option on table load,
			// which will then be passed around with the container and thereby cached
			// useLoadTable should return a TableContainer
			const tbl = useLoadTable(input || step.input, table, store)

			const filter = useColumnFilter(step, tbl)

			if (!isInputColumnStep(step)) {
				return <Component {...props} />
			}

			return (
				<Container className="with-input-column-dropdown">
					<LeftAlignedRow>
						{step.verb !== 'erase' ? (
							<TableColumnDropdown
								required
								table={tbl}
								filter={filter}
								label={label || `Column to ${step.verb}`}
								selectedKey={(step.args as InputColumnArgs).column}
								onChange={handleColumnChange}
							/>
						) : (
							<ColumnOrValueComboBox
								required
								table={tbl}
								label={label || `Column to ${step.verb}`}
								placeholder={'column'}
								text={(step.args as InputColumnArgs).column}
								selectedKey={(step.args as InputColumnArgs).column}
								onChange={handleComboBoxChange}
								styles={dropdownStyles}
							/>
						)}
					</LeftAlignedRow>

					<Component {...props} />
				</Container>
			)
		}
		return memo(WithInputColumnDropdown)
	}
}

function useColumnFilter(step: Step, table?: ColumnTable) {
	const typeMap = useMemo(() => {
		if (table) {
			return types(table)
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
