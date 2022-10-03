/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { IconButton } from '@fluentui/react'

export const Container = styled.div`
	position: relative;

	h1 {
		margin-top: 0;
		text-transform: uppercase;
		color: ${({ theme }) => theme.palette.neutralTertiary};
	}

	h2 {
		color: ${({ theme }) => theme.palette.neutralTertiary};

		display: flex;
		align-items: center;
		gap: 1rem;

		&.active + .details {
			opacity: 1;
			height: auto;
			transform: translateX(0);
			overflow-x: auto;
		}
	}

	table {
		border-collapse: collapse;

		th {
			font-weight: bold;
		}

		td,
		th {
			border: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
			padding: 5px;
			text-align: center;
		}
	}

	.details {
		opacity: 0;
		height: 0;
		transition: transform 0.5s ease-in-out;
		transform: translateX(100%);
		overflow-x: hidden;
	}
`

export const Icon = styled(IconButton as any)`
	font-size: 2.5rem;
`

export const ButtonWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`

export const icons = {
	back: { iconName: 'Back' },
	home: { iconName: 'Home' },
}
