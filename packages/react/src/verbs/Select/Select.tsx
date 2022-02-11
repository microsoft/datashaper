/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectStep } from '@data-wrangling-components/core'
import { Dropdown, IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common/index.js'
import { columnDropdownStyles } from '../../controls/styles.js'
import { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Select.
 */
export const Select: React.FC<StepComponentProps> = memo(function Select({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const tbl = useLoadTable(input || step.input, table, store)

	// default to selecting all columns if none are (this is what we want, right?)
	const internal = useMemo(() => {
		const { columns = [] } = (step as SelectStep).args
		const defaults = columns.length === 0 ? tbl?.columnNames() : columns
		return {
			...step,
			args: {
				columns: defaults,
			},
		} as SelectStep
	}, [step, tbl])

	const handleColumnChange = useCallback(
		(event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
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
					styles={columnDropdownStyles}
					multiSelect
					options={options}
					selectedKeys={selectedKeys}
					onChange={handleColumnChange}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`
