/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

interface CommandBarContainerProps {
	props: IDetailsColumnProps
	renderers: IRenderFunction<IDetailsColumnProps>[]
}

export const CommandBarContainer: React.FC<CommandBarContainerProps> = memo(
	function CommandBarContainer({ props, renderers }) {
		return (
			<Container className="header-command-bar">
				{renderers.map((renderer, i) => (
					<Command key={i}>{renderer(props)}</Command>
				))}
			</Container>
		)
	},
)

const Command = styled.div``
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px 0px;
	border-top: 1px solid ${({ theme }) => theme.application().faint().hex()};
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
