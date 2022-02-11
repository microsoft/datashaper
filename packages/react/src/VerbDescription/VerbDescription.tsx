/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import isNil from 'lodash/isNil.js'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export interface DescriptionRow {
	/**
	 * Text to display in normal font before the value
	 */
	before?: string
	/**
	 * The configuration value to display with emphasized font
	 */
	value?: any
	/**
	 * Text to display in normal font after the value
	 */
	after?: string
	/**
	 * Recursive row children to render indented
	 */
	sub?: DescriptionRow[]
}

export interface VerbDescriptionProps {
	step: Step
	rows: DescriptionRow[]
	showInput?: boolean
	showOutput?: boolean
}
export const VerbDescription: React.FC<VerbDescriptionProps> = memo(
	function VerbDescription({ step, rows, showInput, showOutput }) {
		const rws = useMemo(() => {
			function loop(rows: DescriptionRow[]) {
				return rows.map((row, index) => (
					<Row key={`verb-description-row-${row.value}-${index}`}>
						<KeyValue>
							{row.before ? <Key>{row.before}</Key> : null}
							{isNil(row.value) ? <Unset /> : <Value>{row.value}</Value>}
							{row.after ? <Key>{row.after}</Key> : null}
						</KeyValue>
						{row.sub ? loop(row.sub) : null}
					</Row>
				))
			}
			return loop(rows)
		}, [rows])
		return (
			<Container>
				<Verb>{step.verb}</Verb>
				{showInput ? (
					<Row>
						<KeyValue>
							<Key>table</Key>
							{!step.input ? <Unset /> : <Value>{step.input}</Value>}
						</KeyValue>
					</Row>
				) : null}
				{rws}
				{showOutput ? (
					<Row>
						<KeyValue>
							<Key>into table</Key>
							{!step.output ? <Unset /> : <Value>{step.output}</Value>}
						</KeyValue>
					</Row>
				) : null}
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
