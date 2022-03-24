/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnListStep } from '@data-wrangling-components/core'
import { NodeInput } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { MultiDropdown } from '../../../controls/MultiDropdown.js'
import { useLoadTable } from '../../../index.js'
import type { StepSubcomponentProps } from '../../../types.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const ColumnListInputs: React.FC<StepSubcomponentProps> = memo(
	function ColumnListInputs({ step, store, table, onChange, input, label }) {
		const tbl = useLoadTable(
			input || step.inputs[NodeInput.Input]?.node,
			table,
			store,
		)

		const internal = useMemo(() => step as ColumnListStep, [step])

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

		const handleSelectAllOrNone = useCallback(
			(options: IDropdownOption[]) => {
				onChange &&
					onChange({
						...internal,
						args: {
							...internal.args,
							columns: options.map(o => o.key),
						},
					})
			},
			[onChange, internal],
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
						selectedKeys={internal.args.columns}
						onChange={handleColumnChange}
						onSelectAllOrNone={handleSelectAllOrNone}
					/>
				) : null}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
