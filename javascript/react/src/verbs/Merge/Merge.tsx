/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeStep } from '@data-wrangling-components/core'
import { Dropdown, IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common'
import { MergeStrategyComponent } from '../../controls/MergeStrategyComponent/MergeStrategyComponent.js'
import { dropdownStyles } from '../../controls/styles'
import type { StepComponentProps } from '../../types'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Merge: React.FC<StepComponentProps> = memo(function Merge({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as MergeStep, [step])
	const tbl = useLoadTable(input || internal.input, table, store)

	const handleColumnChange = useCallback(
		(_event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
			const { columns = [] } = internal.args
			let update = [...columns]
			if (option) {
				if (option.selected) {
					update.push(option.key as string)
				} else {
					update = update.filter(c => c !== option.key)
				}
			}
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns: update,
					},
				})
		},
		[internal, onChange],
	)

	const options = useMemo(() => {
		const columns = tbl?.columnNames() || []
		const hash = (internal.args.columns || []).reduce((acc, cur) => {
			acc[cur] = true
			return acc
		}, {} as Record<string, boolean>)
		return columns.map(column => {
			const selected = internal.args?.columns && !!hash[column]
			return {
				key: column,
				text: column,
				selected,
			}
		})
	}, [tbl, internal])

	const selectedKeys = useMemo(
		() => options.filter(o => o.selected).map(o => o.key),
		[options],
	)

	return (
		<Container>
			{tbl ? (
				<Dropdown
					label={'Columns'}
					styles={dropdownStyles}
					multiSelect
					options={options}
					selectedKeys={selectedKeys}
					onChange={handleColumnChange}
				/>
			) : null}

			<MergeStrategyComponent
				input={input}
				step={step}
				store={store}
				table={table}
				onChange={onChange}
			/>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`
