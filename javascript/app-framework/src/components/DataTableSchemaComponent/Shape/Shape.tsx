/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataOrientation } from '@datashaper/schema'
import { memo } from 'react'
import { Case, Switch } from 'react-if'

import {
	Code,
	Container,
	ExampleContainer,
	ExampleDescription,
	ExampleLabel,
} from './Shape.styles.js'
import type { ShapeProps } from './Shape.types.js'
import { TableLayoutOptions } from './TableLayoutOptions.js'

export const Shape: React.FC<ShapeProps> = memo(function Shape({
	shape,
	onChange,
}) {
	return (
		<Container>
			<TableLayoutOptions
				selected={shape?.orientation}
				onChange={orientation => onChange?.({ orientation })}
			/>
			<ExampleContainer>
				<ExampleLabel>Example</ExampleLabel>
				<Switch>
					<Case condition={shape?.orientation === DataOrientation.Array}>
						<ExampleArray />
						<ExampleDescription>
							A flat array of data values.
						</ExampleDescription>
					</Case>
					<Case condition={shape?.orientation === DataOrientation.Values}>
						<ExampleValues />
						<ExampleDescription>
							Each row is an array of values. The first row is usually the
							column names.
						</ExampleDescription>
					</Case>
					<Case condition={shape?.orientation === DataOrientation.Columnar}>
						<ExampleColumnar />
						<ExampleDescription>
							Single object where each key is a column name, and the cell values
							are arrays.
						</ExampleDescription>
					</Case>
					<Case condition={shape?.orientation === DataOrientation.Records}>
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
