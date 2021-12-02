/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleDropdownChange } from '../common'
import { TableDropdown } from '../controls/dropdowns/TableDropdown'
import { StepComponentProps } from '../types'

export interface WithTableDropdownProps extends StepComponentProps {
	Component: React.FC<StepComponentProps>
	label?: string
}

/**
 * This is a higher-order component specifically designed to wrap any step with
 * a dropdown for selecting the input table.
 * Most UIs probably will dictate the input/output chain, so the user doesn't need to select
 * a starting table directly for the intermediary steps.
 */
export const WithTableDropdown: React.FC<WithTableDropdownProps> = memo(
	function WithTableDropdown({ step, store, onChange, Component, label }) {
		const handleTableChange = useHandleDropdownChange(step, 'input', onChange)
		return (
			<Container>
				<LeftAlignedRow>
					<TableDropdown
						store={store}
						label={label || 'Input table'}
						selectedKey={step.input}
						onChange={handleTableChange}
					/>
				</LeftAlignedRow>
				<Component step={step} store={store} onChange={onChange} />
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
