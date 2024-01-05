/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'
import type { NumericFieldScaleBinding } from '@datashaper/workflow'

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { Column } from './Column.js'
import { SpinButton } from '@fluentui/react'
import styled from 'styled-components'

export interface NumericColumnProps {
	binding: NumericFieldScaleBinding
	table: ColumnTable | undefined
}

export const NumericColumn: React.FC<NumericColumnProps> = memo(
	function NumericColumn({ binding, table }) {
		return (
			<FlexContainer>
				<Column table={table} binding={binding} />
				<Domain binding={binding} />
				<Range binding={binding} />
			</FlexContainer>
		)
	},
)

const Domain: React.FC<{ binding: NumericFieldScaleBinding }> = ({
	binding,
}) => {
	const domain = useObservableState(binding.domain$, binding.domain)
	return (
		<>
			Input data domain
			<Row>
				<SpinButton
					label='Min'
					value={domain[0].toString()}
					min={0}
					step={1}
					onChange={(_, value) => {
						binding.domain = [+(value as string), domain[1]]
					}}
					incrementButtonAriaLabel='Increase value by 1'
					decrementButtonAriaLabel='Decrease value by 1'
					styles={{
						root: {
							width: '50%',
						},
					}}
				/>
				<SpinButton
					label='Max'
					value={domain[1].toString()}
					min={0}
					step={1}
					onChange={(_, value) => {
						binding.domain = [domain[0], +(value as string)]
					}}
					incrementButtonAriaLabel='Increase value by 1'
					decrementButtonAriaLabel='Decrease value by 1'
					styles={{
						root: {
							width: '50%',
						},
					}}
				/>
			</Row>
		</>
	)
}

const Range: React.FC<{ binding: NumericFieldScaleBinding }> = ({
	binding,
}) => {
	const range = useObservableState(binding.range$, binding.range)
	return (
		<>
			Output size range
			<Row>
				<SpinButton
					label='Min'
					value={range[0].toString()}
					min={0}
					step={1}
					onChange={(_, value) => {
						binding.range = [+(value as string), range[1]]
					}}
					incrementButtonAriaLabel='Increase value by 1'
					decrementButtonAriaLabel='Decrease value by 1'
					styles={{
						root: {
							width: '50%',
						},
					}}
				/>
				<SpinButton
					label='Max'
					value={range[1].toString()}
					min={0}
					step={0.5}
					onChange={(_, value) => {
						binding.range = [range[0], +(value as string)]
					}}
					incrementButtonAriaLabel='Increase value by 1'
					decrementButtonAriaLabel='Decrease value by 1'
					styles={{
						root: {
							width: '50%',
						},
					}}
				/>
			</Row>
		</>
	)
}

const FlexContainer = styled.div`
		display: flex;
		flex-direction: column;
		gap: 12px;
	`

const Row = styled.div`
		display: flex;
		gap: 12px;
	`
