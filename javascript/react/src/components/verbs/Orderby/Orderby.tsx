/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@datashaper/schema'
import { ActionButton, Label } from '@fluentui/react'
import { memo } from 'react'

import {
	useSimpleDropdownOptions,
	useStepDataTable,
	useTableColumnNames,
} from '../../../hooks/index.js'
import type { StepComponentProps } from '../../../types.js'
import { useAddButtonClickedHandler, useSorts } from './Orderby.hooks.js'
import { Container, icons, Sorts } from './Orderby.styles.js'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps<OrderbyArgs>> = memo(
	function Orderby({ step, workflow, input, table, onChange }) {
		const dataTable = useStepDataTable(step, workflow, input, table)
		const columns = useTableColumnNames(dataTable)
		const columnOptions = useSimpleDropdownOptions(columns)
		const sorts = useSorts(step, columnOptions, onChange)
		const handleButtonClick = useAddButtonClickedHandler(
			dataTable,
			step,
			onChange,
		)

		return (
			<Container>
				<Label required>Sorts</Label>
				<Sorts>{sorts}</Sorts>
				<ActionButton
					onClick={handleButtonClick}
					iconProps={icons.add}
					disabled={!dataTable}
				>
					Add sort
				</ActionButton>
			</Container>
		)
	},
)
