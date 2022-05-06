/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IButtonProps } from '@fluentui/react'
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

export const StepBlock = styled.div`
	display: flex;
`

export const InputsSection = styled.div`
	margin-bottom: 80px;
`

export const TableSection = styled.div`
	max-height: 400px;
`

export const StepsColumn = styled.div`
	width: 600px;
`

export const OutputsColumn = styled.div`
	margin-left: 40px;
	display: flex;
	flex-direction: column;
`

export const runPipelineRootStyles: IButtonProps['styles'] = {
	root: { width: 180 },
}
export const icons = {
	download: { iconName: 'Download' },
}
