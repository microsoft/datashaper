/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TableStore,
	SetOperationStep,
	Step,
} from '@data-wrangling-components/core'
import { ActionButton, IconButton } from '@fluentui/react'
import { internal as ArqueroTypes } from 'arquero'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { TableDropdown } from '..'
import { LeftAlignedRow, useLoadTable } from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs to create a list of tables.
 * E.g., for set operations
 */
export const TableListInputs: React.FC<StepComponentProps> = memo(
	function TableListInputs({ step, store, onChange }) {
		const internal = useMemo(() => step as SetOperationStep, [step])

		const [table, setTable] = useState<ArqueroTypes.ColumnTable | undefined>()
		useLoadTable(internal.input, store, setTable)

		const others = useOthers(internal, store, onChange)

		const handleButtonClick = useCallback(() => {
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						// TODO: this just establishes an empty table, can we get the store list and pick the next available?
						others: [...internal.args.others, ''],
					},
				})
		}, [internal, onChange])

		return (
			<Container>
				{others}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!table}
				>
					Add table
				</ActionButton>
			</Container>
		)
	},
)

function useOthers(
	step: SetOperationStep,
	store: TableStore,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return step.args.others.map((other, index) => {
			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.others.splice(index, 1)
				onChange && onChange(update)
			}

			return (
				<LeftAlignedRow key={`set-op-${other}-${index}`}>
					<TableDropdown
						label={''}
						store={store}
						selectedKey={other}
						onChange={(_evt, option) => {
							const update = { ...step }
							if (option) {
								update.args.others[index] = `${option.key}`
							}
							onChange && onChange(update)
						}}
					/>
					<IconButton
						title={'Remove this table'}
						iconProps={{ iconName: 'Delete' }}
						onClick={handleDeleteClick}
					/>
				</LeftAlignedRow>
			)
		})
	}, [step, store, onChange])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
