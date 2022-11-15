/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationTestResult } from '@datashaper/schema'
import type { ITooltipHostStyles } from '@fluentui/react/lib/Tooltip'
import { TooltipHost } from '@fluentui/react/lib/Tooltip'
import { useId } from '@fluentui/react-hooks'
import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useIconProps } from '../hooks/useIconProps.js'
import { useValidationIconProps } from '../hooks/useValidationIconProps.js'
import { useValidationRenderer } from '../hooks/useValidationRenderer.js'
import { useTextAlignStyle } from './hooks.js'
import type { FormattedCellProps } from './types.js'
import {
	Container,
	LeftIcon,
	ToolTipContainer,
	ValueContainer,
} from './ValidationCell.styles.js'

/**
 * Basic rendering of text values.
 */

const hostStyles: Partial<ITooltipHostStyles> = {
	root: { display: 'inline-block' },
}
const calloutProps = { gapSpace: 0 }

export const ValidationCell: React.FC<FormattedCellProps> = memo(
	function TextCell({ item, column, textAlign = 'left', validationResult }) {
		const value = getValue(item, column)
		const style = useTextAlignStyle(textAlign)

		const tooltipId = useId('tooltip')

		const iconProps = useIconProps(validationResult)
		const validationIconProps = useValidationIconProps(
			iconProps,
			validationResult,
		)

		const resultValidation = useValidationRenderer(value, validationResult)

		return (
			<Container style={style}>
				{validationResult !== undefined &&
					resultValidation.map(
						(result: ValidationTestResult, index: number) => {
							if (result.fail) {
								return (
									<ToolTipContainer key={index}>
										<TooltipHost
											content={result.rule}
											id={tooltipId}
											calloutProps={calloutProps}
											styles={hostStyles}
										>
											<LeftIcon
												aria-describedby={tooltipId}
												{...validationIconProps}
											/>
										</TooltipHost>
									</ToolTipContainer>
								)
							}
							return null
						},
					)}

				<ValueContainer>{value.toString()}</ValueContainer>
			</Container>
		)
	},
)
