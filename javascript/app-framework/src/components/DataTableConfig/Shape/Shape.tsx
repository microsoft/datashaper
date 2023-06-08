/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataOrientation } from '@datashaper/schema'
import { Position, SpinButton } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback } from 'react'
import { Case, Switch, When } from 'react-if'

import {
	Code,
	Container,
	ExampleContainer,
	ExampleDescription,
	ExampleLabel,
	FieldContainer,
} from './Shape.styles.js'
import type { ShapeProps } from './Shape.types.js'
import { TableLayoutOptions } from './TableLayoutOptions.js'

export const Shape: React.FC<ShapeProps> = memo(function Shape({ shape }) {
	const orientation = useObservableState(shape.orientation$, shape.orientation)
	const matrix = useObservableState(shape.matrix$, shape.matrix)
	const onMatrixChange = useCallback(
		(rows: number, columns: number) => (shape.matrix = [rows, columns]),
		[shape],
	)
	return (
		<Container>
			<TableLayoutOptions
				selected={orientation}
				onChange={(orientation) => (shape.orientation = orientation)}
			/>
			<When condition={orientation === DataOrientation.Array}>
				<FieldContainer>
					<SpinButton
						labelPosition={Position.top}
						label='Rows'
						value={matrix?.[0].toString() || ''}
						min={0}
						step={1}
						onChange={(_, value) =>
							onMatrixChange(+(value as string), matrix?.[1] || 0)
						}
						incrementButtonAriaLabel='Increase value by 1'
						decrementButtonAriaLabel='Decrease value by 1'
					/>
					<SpinButton
						labelPosition={Position.top}
						label='Columns'
						value={matrix?.[1].toString() || ''}
						min={0}
						step={1}
						onChange={(_, value) =>
							onMatrixChange(matrix?.[0] || 0, +(value as string))
						}
						incrementButtonAriaLabel='Increase value by 1'
						decrementButtonAriaLabel='Decrease value by 1'
					/>
				</FieldContainer>
			</When>
			<ExampleContainer>
				<ExampleLabel>Example</ExampleLabel>
				<Switch>
					<Case condition={orientation === DataOrientation.Array}>
						<ExampleArray />
						<ExampleDescription>
							A flat array of data values. They will be assigned a default
							column name (col1).
						</ExampleDescription>
					</Case>
					<Case condition={orientation === DataOrientation.Values}>
						<ExampleValues />
						<ExampleDescription>
							Each row is an array of values. The first row is used for the
							column names.
						</ExampleDescription>
					</Case>
					<Case condition={orientation === DataOrientation.Columnar}>
						<ExampleColumnar />
						<ExampleDescription>
							Single object where each key is a column name, and the cell values
							are arrays attached to the key.
						</ExampleDescription>
					</Case>
					<Case condition={orientation === DataOrientation.Records}>
						<ExampleRecords />
						<ExampleDescription>
							An array of data objects, each object is a row.
						</ExampleDescription>
					</Case>
				</Switch>
			</ExampleContainer>
		</Container>
	)
})

const ExampleArray: React.FC = () => {
	return (
		<Code>
			{`[
  "val1", "val2", "val3", ...
]`}
		</Code>
	)
}

const ExampleValues: React.FC = () => {
	return (
		<Code>
			{`[
  ["colA", "colB", "colC"],
  ["val1", "val2", "val3"],
  ...
]`}
		</Code>
	)
}

const ExampleRecords: React.FC = () => {
	return (
		<Code>
			{`[
  {"colA": val1, "colB: val1},
  {"colA": val2, "colB: val2},
  ...
]`}
		</Code>
	)
}

const ExampleColumnar: React.FC = () => {
	return (
		<Code>
			{`{
  "colA": [val1, val2, ...],
  "colB": [val1, val2, ...]
}`}
		</Code>
	)
}
