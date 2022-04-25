/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MergeArgs } from '@data-wrangling-components/core'
import { MergeStrategy } from '@data-wrangling-components/core'
import {
	dropdownStyles,
	EnumDropdown,
} from '@data-wrangling-components/react-controls'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, TextField } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange } from '../../common/hooks.js'
import { LeftAlignedRow, useHandleTextFieldChange } from '../../common/index.js'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Merge: React.FC<StepComponentProps<MergeArgs>> = memo(
	withLoadedTable(function Merge({ step, onChange, dataTable }) {
		const handleColumnChange = useCallback(
			(_event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
				const { columns = [] } = step.args
				let update = [...columns]
				if (option) {
					if (option.selected) {
						update.push(option.key as string)
					} else {
						update = update.filter(c => c !== option.key)
					}
				}
				onChange?.({
					...step,
					args: {
						...step.args,
						columns: update,
					},
				})
			},
			[step, onChange],
		)

		const handleOpChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.strategy = val as MergeStrategy),
			onChange,
		)

		const handleDelimiterChange = useHandleTextFieldChange(
			step,
			(s, val) => (s.args.delimiter = val),
			onChange,
		)

		const options = useMemo(() => {
			const columns = dataTable?.columnNames() || []
			const hash = (step.args.columns || []).reduce((acc, cur) => {
				acc[cur] = true
				return acc
			}, {} as Record<string, boolean>)
			return columns.map(column => {
				const selected = step.args?.columns && !!hash[column]
				return {
					key: column,
					text: column,
					selected,
				}
			})
		}, [dataTable, step])

		const selectedKeys = useMemo(
			() => options.filter(o => o.selected).map(o => o.key),
			[options],
		)

		return (
			<Container>
				<LeftAlignedRow>
					{dataTable ? (
						<Dropdown
							label={'Columns'}
							styles={dropdownStyles}
							multiSelect
							options={options}
							selectedKeys={selectedKeys}
							onChange={handleColumnChange}
						/>
					) : null}
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						label={'Merge strategy'}
						enumeration={MergeStrategy}
						selectedKey={step.args.strategy}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
				{step.args.strategy === MergeStrategy.Concat ? (
					<LeftAlignedRow>
						<TextField
							label={'Delimiter'}
							placeholder={'Text delimiter'}
							value={step.args.delimiter && `${step.args.delimiter}`}
							styles={dropdownStyles}
							onChange={handleDelimiterChange}
						/>
					</LeftAlignedRow>
				) : null}
			</Container>
		)
	}),
)
const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
