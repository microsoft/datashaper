/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IDropdownOption,
	IDropdownProps,
	ISelectableOption,
} from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { dropdownStyles } from './styles.js'

export interface ColumnListMultiDropdownProps
	extends Omit<IDropdownProps, 'options'> {
	columns: string[]
	onSelectAllOrNone?: (columns: string[]) => void
}

/**
 * Dropdown wrapper to automatically list the tables in a TableStore.
 */
export const ColumnListMultiDropdown: React.FC<ColumnListMultiDropdownProps> =
	memo(function ColumnListMultiDropdown(props) {
		const { columns, selectedKeys, onSelectAllOrNone, ...rest } = props
		const options = useMemo(() => {
			const hash = (selectedKeys || ([] as any)).reduce(
				(acc: Record<string, boolean>, cur: any) => {
					acc[cur] = true
					return acc
				},
				{},
			)
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
		}, [columns, selectedKeys])

		const handleSelectAllOrNone = useCallback(
			(all: boolean) => {
				onSelectAllOrNone && onSelectAllOrNone(all ? columns : [])
			},
			[columns, onSelectAllOrNone],
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
			<Dropdown
				required
				label={'Columns'}
				placeholder={'Select columns'}
				styles={dropdownStyles}
				multiSelect
				options={options}
				selectedKeys={selectedKeys}
				onRenderOption={handleRenderOption}
				{...rest}
			/>
		)
	})

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
