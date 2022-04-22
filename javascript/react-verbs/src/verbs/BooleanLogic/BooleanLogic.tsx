/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import {
	dropdownStyles,
	EnumDropdown,
} from '@data-wrangling-components/react-controls'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange } from '../../common/hooks.js'
import { LeftAlignedRow } from '../../common/index.js'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogic: React.FC<StepComponentProps<BooleanArgs>> = memo(
	withLoadedTable<BooleanArgs>(function BooleanLogic({
		step,
		onChange,
		dataTable,
	}) {
		const handleColumnChange = useCallback(
			(_event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
				const { columns = [] } = step.args
				let update = [...columns]
				if (option) {
					if (option.selected) {
						update.push(option.key as string)
					} else {
						update = update.filter(c => c !== option.key)
					}
				}
				onChange?.({
					...step,
					args: {
						...step.args,
						columns: update,
					},
				})
			},
			[step, onChange],
		)

		const handleOpChange = useHandleDropdownChange(
			step,
			'args.operator',
			onChange,
		)

		const options = useMemo(() => {
			const columns = dataTable?.columnNames() || []
			const hash = (step.args.columns || []).reduce((acc, cur) => {
				acc[cur] = true
				return acc
			}, {} as Record<string, boolean>)
			return columns.map(column => {
				const selected = step.args?.columns && !!hash[column]
				return {
					key: column,
					text: column,
					selected,
				}
			})
		}, [dataTable, step])

		const selectedKeys = useMemo(
			() => options.filter(o => o.selected).map(o => o.key),
			[options],
		)

		return (
			<Container>
				<LeftAlignedRow>
					{dataTable ? (
						<Dropdown
							label={'Columns'}
							styles={dropdownStyles}
							multiSelect
							options={options}
							selectedKeys={selectedKeys}
							onChange={handleColumnChange}
						/>
					) : null}
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						label={'Logical operator'}
						labels={{
							or: 'OR',
							and: 'AND',
							nor: 'NOR',
							nand: 'NAND',
							xor: 'XOR',
						}}
						enumeration={BooleanOperator}
						selectedKey={step.args.operator}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	}),
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
