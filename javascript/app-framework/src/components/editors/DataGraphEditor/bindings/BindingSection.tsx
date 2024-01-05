/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export interface BindingSectionProps {
	label: string
}

export const BindingSection: React.FC<
	React.PropsWithChildren<BindingSectionProps>
> = ({ label, children }) => {
	return (
		<Container>
			<Header>{label}</Header>
			{children}
		</Container>
	)
}

const Container = styled.div``

const Header = styled.div`
		font-weight: bold;
		padding: 4px;
		background: ${({ theme }) => theme.palette.neutralQuaternaryAlt};
		border: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
	`
