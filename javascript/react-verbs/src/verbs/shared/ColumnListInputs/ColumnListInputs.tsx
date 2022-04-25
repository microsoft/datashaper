/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { MultiDropdown } from '@data-wrangling-components/react-controls'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { withLoadedTable } from '../../../common/withLoadedTable.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const ColumnListInputs = memo(
	withLoadedTable<InputColumnListArgs>(function ColumnListInputs({
		step,
		onChange,
		label,
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
				dataTable?.columnNames().map(name => ({
					key: name,
					text: name,
				})) || []
			)
		}, [dataTable])
		return (
			<Container>
				{dataTable ? (
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
	}),
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
