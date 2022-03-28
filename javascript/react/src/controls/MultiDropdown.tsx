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

export interface MultiDropdownProps extends IDropdownProps {
	onSelectAllOrNone?: (options: IDropdownOption[]) => void
}

/**
 * Dropdown wrapper to manage multi-select with a select all/none helper.
 */
export const MultiDropdown: React.FC<MultiDropdownProps> = memo(
	function MultiDropdown({
		options,
		selectedKeys,
		onSelectAllOrNone,
		...props
	}) {
		const opts = useMemo(() => {
			const hash = (selectedKeys || ([] as any)).reduce(
				(acc: Record<string, boolean>, cur: any) => {
					acc[cur] = true
					return acc
				},
				{},
			)
			const main: IDropdownOption[] = options.map(option => {
				const selected = !!hash[option.key]
				return {
					...option,
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
		}, [options, selectedKeys])

		const handleSelectAllOrNone = useCallback(
			(all: boolean) => {
				onSelectAllOrNone && onSelectAllOrNone(all ? options : [])
			},
			[options, onSelectAllOrNone],
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
				multiSelect
				options={opts}
				selectedKeys={selectedKeys}
				styles={dropdownStyles}
				onRenderOption={handleRenderOption}
				{...props}
			/>
		)
	},
)

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
