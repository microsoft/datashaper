/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criteria, FilterArgs } from '@datashaper/schema'
import { Label } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useStepInputTable } from '../../../../hooks/index.js'
import { FilterFunction } from '../shared/index.js'
import type { StepFormProps } from '../types.js'
import { Container, CriteriaContainer, Vertical } from './FilterForm.styles.js'

/**
 * Provides inputs for a Filter step.
 */
export const FilterForm: React.FC<StepFormProps<FilterArgs>> = memo(
	function FilterForm({ step, workflow, input, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input)

		const handleFilterChange = useCallback(
			(criteria: Criteria) => {
				onChange?.({
					...step,
					args: {
						...step.args,
						criteria,
					},
				})
			},
			[step, onChange],
		)

		if (!dataTable) {
			return null
		}
		return (
			<Container>
				<Label>Function</Label>
				<CriteriaContainer>
					<Vertical>
						<FilterFunction
							table={dataTable}
							column={step.args.column}
							criteria={step.args.criteria}
							onChange={handleFilterChange}
						/>
					</Vertical>
				</CriteriaContainer>
			</Container>
		)
	},
)
