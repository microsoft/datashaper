/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 20px 0px 20px;
`

export const Workspace = styled.div`
	width: 100%;
`

export const Commands = styled.div`
	width: 200px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	justify-content: space-between;
`

export const Buttons = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`
export const InputsSection = styled.div`
	margin-bottom: 80px;
`

export const icons = {
	download: { iconName: 'Download' },
}
