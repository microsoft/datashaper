/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isOutputColumnStep } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import isNil from 'lodash-es/isNil.js'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import type {
	DescriptionRow,
	VerbDescriptionProps,
} from '@data-wrangling-components/react-types'

function VerbDescriptionFn<T extends object | void>({
	step,
	rows,
	showInput,
	showOutput,
	showOutputColumn,
	style,
}: VerbDescriptionProps<T>) {
	const rws = useMemo(() => {
		function loop(rows: DescriptionRow[]) {
			return rows.map((row, index) => (
				<Row
					key={`verb-description-row-${row.value}-${index}`}
					title={row.title}
				>
					<KeyValue>
						{row.before ? <Key>{row.before}</Key> : null}
						{isNil(row.value) ? (
							<Unset />
						) : (
							<Value title={row.value}>{row.value}</Value>
						)}
						{row.after ? <Key>{row.after}</Key> : null}
					</KeyValue>
					{row.sub ? loop(row.sub) : null}
				</Row>
			))
		}
		return loop(rows)
	}, [rows])
	const shouldShowOutputColumn = showOutputColumn && isOutputColumnStep(step)
	const input = step.input[NodeInput.Source]?.node
	return (
		<Container style={style}>
			<Verb>{step.verb}</Verb>
			{showInput ? (
				<Row>
					<KeyValue>
						<Key>table</Key>
						{!input ? <Unset /> : <Value>{input}</Value>}
					</KeyValue>
				</Row>
			) : null}
			{rws}
			{showOutput ? (
				<Row>
					<KeyValue>
						<Key>into table</Key>
						{!step.id ? <Unset /> : <Value>{step.id}</Value>}
					</KeyValue>
				</Row>
			) : null}
			{shouldShowOutputColumn ? (
				<Row>
					<KeyValue>
						<Key>as column</Key>
						{!(step.args as any).to ? (
							<Unset />
						) : (
							<Value>{(step.args as any).to}</Value>
						)}
					</KeyValue>
				</Row>
			) : null}
		</Container>
	)
}

export const VerbDescription = memo(VerbDescriptionFn)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-height: 180px;
`

const Verb = styled.div`
	text-transform: uppercase;
	font-weight: bold;
	align-items: center;
	width: 100%;
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
	max-width: 240px;
	text-overflow: ellipsis;
	overflow: hidden;
	font-weight: bold;
	color: ${({ theme }) => theme.application().midContrast().hex()};
`
