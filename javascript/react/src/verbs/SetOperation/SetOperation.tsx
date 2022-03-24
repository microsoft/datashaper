/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	SetOperationStep,
	Step,
	TableStore,
} from '@data-wrangling-components/core'
import { NodeInput } from '@data-wrangling-components/core'
import { ActionButton, IconButton, Label } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useLoadTable } from '../../common/index.js'
import { TableDropdown } from '../../controls/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs to create a list of tables.
 * E.g., for set operations
 */
export const SetOperation: React.FC<StepComponentProps> = memo(
	function SetOperation({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as SetOperationStep, [step])

		const tbl = useLoadTable(
			input || internal.inputs[NodeInput.Input]?.node,
			table,
			store,
		)

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
				<Label>With tables</Label>
				{others}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!tbl}
				>
					Add table
				</ActionButton>
			</Container>
		)
	},
)

function useOthers(
	step: SetOperationStep,
	store?: TableStore,
	onChange?: (step: Step) => void,
) {
	return useMemo(() => {
		return step.args.others.map((other, index) => {
			const handleDeleteClick = () => {
				const update = { ...step }
				update.args.others.splice(index, 1)
				onChange && onChange(update)
			}
			if (!store) {
				return null
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
