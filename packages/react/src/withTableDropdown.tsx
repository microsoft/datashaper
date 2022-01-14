/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleDropdownChange } from './common'
import { TableDropdown } from './controls'
import { StepComponentProps } from './types'

export const withTableDropdown = (label?: string) => {
	return (Component: React.FC<StepComponentProps>) => {
		const WithTableDropdown: React.FC<StepComponentProps> = props => {
			const { step, store, onChange } = props
			const handleTableChange = useHandleDropdownChange(step, 'input', onChange)
			return (
				<Container className="with-table-dropdown">
					<LeftAlignedRow>
						<TableDropdown
							store={store}
							label={label || 'Input table'}
							selectedKey={step.input}
							onChange={handleTableChange}
						/>
					</LeftAlignedRow>
					<Component {...props} />
				</Container>
			)
		}
		return memo(WithTableDropdown)
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
