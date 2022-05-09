/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentCard } from '@fluentui/react'
import styled from 'styled-components'

export const styles = {
	card: {
		root: {
			minWidth: 'unset',
		},
	},
	actions: { root: { padding: 'unset' } },
}

export const CardContent = styled.div`
	padding: 8px;
`

export const Card = styled(DocumentCard)`
	min-width: fit-content;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`
