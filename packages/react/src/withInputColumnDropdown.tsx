/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	InputColumnArgs,
	isInputColumnStep,
} from '@data-wrangling-components/core'
import React, { memo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleDropdownChange, useLoadTable } from './common'
import { TableColumnDropdown } from './controls'
import { HOCFunction, StepComponentProps } from './types'
/**
 * Higher order component generator to wrap a Step in the input column dropdown.
 * @param label optional label to use for the dropdown instead of the default.
 * @returns
 */
export const withInputColumnDropdown = (
	label?: string,
): HOCFunction<StepComponentProps> => {
	return Component => {
		const WithInputColumnDropdown: React.FC<StepComponentProps> = props => {
			const { step, store, onChange, input, table } = props
			const handleColumnChange = useHandleDropdownChange(
				step,
				'args.column',
				onChange,
			)
			const tbl = useLoadTable(input || step.input, table, store)
			if (!isInputColumnStep(step)) {
				return <></>
			}
			return (
				<Container className="with-input-column-dropdown">
					<LeftAlignedRow>
						<TableColumnDropdown
							required
							table={tbl}
							label={label || `Column to ${step.verb}`}
							selectedKey={(step.args as InputColumnArgs).column}
							onChange={handleColumnChange}
						/>
					</LeftAlignedRow>
					<Component {...props} />
				</Container>
			)
		}
		return memo(WithInputColumnDropdown)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
