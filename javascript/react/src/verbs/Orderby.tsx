/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { OrderbyArgs } from '@data-wrangling-components/core'
import { ActionButton } from '@fluentui/react'
import { memo } from 'react'

import { withLoadedTable } from '../hocs/index.js'
import {
	useSimpleDropdownOptions,
	useTableColumnNames,
} from '../hooks/index.js'
import type { StepComponentProps } from '../types.js'
import { useAddButtonClickedHandler, useSorts } from './Orderby.hooks.js'
import { Container, icons } from './Orderby.styles.js'

/**
 * Provides inputs for an OrderBy step.
 */
export const Orderby: React.FC<StepComponentProps<OrderbyArgs>> = memo(
	withLoadedTable(function Orderby({ step, onChange, dataTable }) {
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
				{sorts}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={icons.add}
					disabled={!dataTable}
				>
					Add sort
				</ActionButton>
			</Container>
		)
	}),
)
