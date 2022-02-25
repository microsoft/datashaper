/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SelectStep } from '@data-wrangling-components/core'
import { Dropdown, IDropdownOption, ISelectableOption } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable } from '../../common/index.js'
import { columnDropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Select.
 */
export const Select: React.FC<StepComponentProps> = memo(function Select({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const tbl = useLoadTable(input || step.input, table, store)

	const internal = useMemo(() => step as SelectStep, [step])

	const handleColumnChange = useCallback(
		(_event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
			const { columns = [] } = internal.args
			let update = [...columns]
			if (option) {
				if (option.selected) {
					update.push(option.key as string)
				} else {
					update = update.filter(c => c !== option.key)
				}
			}
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns: update,
					},
				})
		},
		[internal, onChange],
	)

	const options = useMemo(() => {
		const columns = tbl?.columnNames() || []
		const hash = (internal.args.columns || []).reduce((acc, cur) => {
			acc[cur] = true
			return acc
		}, {} as Record<string, boolean>)
		const main: IDropdownOption[] = columns.map(column => {
			const selected = !!hash[column]
			return {
				key: column,
				text: column,
				selected,
			}
		})
		return [
			...main,
			{
				key: '--divider--',
				text: '-',
				itemType: 1,
				selected: false,
			},
			{
				key: '--actions--',
				text: '',
				itemType: 2,
				data: true,
				selected: false,
			},
		] as IDropdownOption[]
	}, [tbl, internal])

	const selectedKeys = useMemo(
		() => options.filter(o => o.selected).map(o => `${o.key}`) as string[],
		[options],
	)

	const handleSelectAllOrNone = useCallback(
		(all: boolean) => {
			onChange &&
				onChange({
					...internal,
					args: {
						...internal.args,
						columns: all ? tbl?.columnNames() : [],
					},
				})
		},
		[tbl, internal, onChange],
	)

	const handleRenderOption: IRenderFunction<ISelectableOption<any>> =
		useCallback(
			option => {
				if (option?.data) {
					return (
						<Selector>
							<Link onClick={() => handleSelectAllOrNone(true)}>All</Link>
							<Sep>|</Sep>
							<Link onClick={() => handleSelectAllOrNone(false)}>None</Link>
						</Selector>
					)
				} else {
					return <span>{option?.text}</span>
				}
			},
			[handleSelectAllOrNone],
		)

	return (
		<Container>
			{tbl ? (
				<Dropdown
					required
					label={'Columns'}
					placeholder={'Select columns'}
					styles={columnDropdownStyles}
					multiSelect
					options={options}
					selectedKeys={selectedKeys}
					onChange={handleColumnChange}
					onRenderOption={handleRenderOption}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`

const Selector = styled.div`
	display: flex;
	justify-content: space-around;
`
const Link = styled.a`
	cursor: pointer;
`

const Sep = styled.div`
	margin-left: 4px;
	margin-right: 4px;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`
