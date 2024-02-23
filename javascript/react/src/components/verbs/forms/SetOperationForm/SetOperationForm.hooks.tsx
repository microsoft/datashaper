/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, Workflow } from '@datashaper/workflow'
import { IconButton } from '@fluentui/react'
import { useMemo } from 'react'

import {
	useTableDropdownOptions,
	useWorkflowInput,
} from '../../../../hooks/index.js'
import { TableDropdown } from '../../../controls/index.js'
import { LeftAlignedRow } from '../styles.js'
import { icons } from './SetOperationForm.styles.js'

export function useOthers(
	step: Step,
	onChange?: (step: Step) => void,
	workflow?: Workflow,
): (JSX.Element | null)[] {
	const input = useWorkflowInput(workflow)
	const tableOptions = useTableDropdownOptions(
		workflow,
		(name) => name !== input?.id,
	)
	return useMemo<(JSX.Element | null)[]>(() => {
		return (step.input.others || EMPTY).map((other, index) => {
			// on delete, remove the input
			const handleDeleteClick = () => {
				onChange?.({
					...step,
					input: {
						...step.input,
						others: (step.input.others || EMPTY).filter(
							(o) => o.step !== other.step,
						),
					} as Step['input'],
				})
			}
			if (!workflow) {
				return null
			}
			return (
				<LeftAlignedRow key={`set-op-${other}-${index}`}>
					<TableDropdown
						label={''}
						options={tableOptions}
						selectedKey={other.step}
						onChange={(_evt, option) => {
							const update = { ...step }
							if (option) {
								other.step = `${option.key}`
							}
							onChange?.(update)
						}}
					/>
					<IconButton
						title={'Remove this table'}
						iconProps={icons.delete}
						onClick={handleDeleteClick}
					/>
				</LeftAlignedRow>
			)
		})
	}, [step, workflow, tableOptions, onChange])
}

const EMPTY: any[] = []
