/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownStyles } from '@fluentui/react'
import styled from 'styled-components'

export const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { marginTop: '4px' },
}

export const Container = styled.div`
	display: flex;
	padding: 0 12px 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 170px;
	margin-bottom: 2rem;
`

export const Examples = styled.div``
export const ExamplesContainer = styled.div``

export const Description = styled.div`
	width: 400px;
	flex-direction: column;
	justify-content: center;
`

export const ControlBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

export const Control = styled.div`
	width: 200px;
`

export const DropBlock = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 10px;
`

export const Drop = styled.div`
	width: 160px;
	height: 50px;
`
