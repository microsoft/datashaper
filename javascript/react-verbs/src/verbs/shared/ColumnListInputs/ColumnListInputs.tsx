/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { MultiDropdown } from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useLoadTable } from '../../../common/hooks.js'
import type { StepSubcomponentProps } from '../../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const ColumnListInputs = memo(function ColumnListInputs<
	T extends InputColumnListArgs,
>({ step, store, table, onChange, input, label }: StepSubcomponentProps<T>) {
	const tbl = useLoadTable(
		input || step.input[NodeInput.Source]?.node,
		table,
		store,
	)

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

	const handleSelectAllOrNone = useCallback(
		(options: IDropdownOption[]) => {
			onChange?.({
				...step,
				args: {
					...step.args,
					columns: options.map(o => o.key as string),
				},
			})
		},
		[onChange, step],
	)

	const options = useMemo(() => {
		return (
			tbl?.columnNames().map(name => ({
				key: name,
				text: name,
			})) || []
		)
	}, [tbl])
	return (
		<Container>
			{tbl ? (
				<MultiDropdown
					required
					label={label || 'Columns'}
					placeholder={'Select columns'}
					options={options}
					selectedKeys={step.args.columns}
					onChange={handleColumnChange}
					onSelectAllOrNone={handleSelectAllOrNone}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
