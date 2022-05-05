import styled from 'styled-components'
import { DocumentCard } from '@fluentui/react'

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
