/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export interface DescriptionRow {
	pre?: string
	value?: any
	post?: string
	sub?: DescriptionRow[]
}

export interface VerbDescriptionProps {
	verb: string
	rows: DescriptionRow[]
}
export const VerbDescription: React.FC<VerbDescriptionProps> = memo(
	function VerbDescription({ verb, rows }) {
		const rws = useMemo(() => {
			function loop(rows) {
				return rows.map((row, index) => (
					<Row key={`verb-description-row-${row.value}-${index}`}>
						<KeyValue>
							{row.pre ? <Key>{row.pre}</Key> : null}
							{row.value ? <Value>{row.value}</Value> : <Unset />}
							{row.post ? <Key>{row.post}</Key> : null}
						</KeyValue>
						{row.sub ? loop(row.sub) : null}
					</Row>
				))
			}
			return loop(rows)
		}, [rows])
		return (
			<Container>
				<Verb>{verb}</Verb>
				{rws}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`

const Verb = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const Row = styled.div`
	padding-left: 8px;
	display: flex;
	flex-direction: column;
`

const KeyValue = styled.div`
	display: flex;
	justify-content: flex-start;
	gap: 4px;
`

const Key = styled.div``

const Unset = styled.div`
	color: ${({ theme }) => theme.application().lowContrast().hex()};
	&:before {
		content: 'unset';
	}
`

const Value = styled.div`
	color: ${({ theme }) => theme.application().accent().hex()};
`
