/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type ITooltipHostStyles,
	TooltipHost,
	DirectionalHint,
} from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useGetColumnValidationErrors } from '../hooks/useGetColumnValidationErrors.js'
import { useValidationErrors } from '../hooks/useValidationErrors.js'
import type { FormattedCellProps } from './types.js'
import { Warning, WarningContainer } from './ValidationCellWrapper.styles.js'

const hostStyles: Partial<ITooltipHostStyles> = {
	root: { display: 'inline-block' },
}
const calloutProps = { gapSpace: 0 }

/**
 * Wraps any cell rendering with indication of validation errors if present.
 * This statically fixes the left spacing of the contents so there is room for a warning triangle in the corner (like Excel).
 */
export const ValidationCellWrapper: React.FC<
	React.PropsWithChildren<FormattedCellProps>
> = memo(function ValidationCellWrapper({
	item,
	column,
	validationResult,
	children,
}) {
	const value = getValue(item, column)
	const tooltipId = useId('tooltip')
	const errors = useValidationErrors(value, validationResult)
	const errorMessages = useGetColumnValidationErrors(
		'This cell value violates the following constraints:',
		errors,
	)
	return (
		<>
			<WarningContainer>
				{errorMessages && (
					<TooltipHost
						content={errorMessages}
						id={tooltipId}
						calloutProps={calloutProps}
						styles={hostStyles}
						directionalHint={DirectionalHint.bottomRightEdge}
					>
						<Warning />
					</TooltipHost>
				)}
			</WarningContainer>
			{children}
		</>
	)
})
