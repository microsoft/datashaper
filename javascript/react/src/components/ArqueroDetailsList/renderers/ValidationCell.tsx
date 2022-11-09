/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldError, ValidationTestResult } from '@datashaper/schema'
import { ErrorCode } from '@datashaper/schema'
import type { ITooltipHostStyles } from '@fluentui/react/lib/Tooltip'
import { TooltipHost } from '@fluentui/react/lib/Tooltip'
import { useId } from '@fluentui/react-hooks'
import { memo } from 'react'

import { getValue } from '../ArqueroDetailsList.utils.js'
import { useIconProps } from '../hooks/useIconProps.js'
import { useValidationIconProps } from '../hooks/useValidationIconProps.js'
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
export const ValidationCell: React.FC<FormattedCellProps> = memo(
	function TextCell({ item, column, textAlign = 'left', validationResult }) {
		const value = getValue(item, column)
		const style = useTextAlignStyle(textAlign)
		const hostStyles: Partial<ITooltipHostStyles> = {
			root: { display: 'inline-block' },
		}
		const tooltipId = useId('tooltip')
		const calloutProps = { gapSpace: 0 }

		const iconProps = useIconProps(validationResult)
		const validationIconProps = useValidationIconProps(
			iconProps,
			validationResult,
		)

		return (
			<Container style={style}>
				{validationResult !== undefined &&
					validationResult.errors.map((e: FieldError, index: number) => {
						let result: ValidationTestResult = {
							fail: false,
							indexes: [],
							rule: ErrorCode.Required,
						}

						if (e.callbackFunction !== undefined) {
							result = e.callbackFunction([value], false)
						}

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
					})}

				<ValueContainer>{value.toString()}</ValueContainer>
			</Container>
		)
	},
)
