/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { IconButton, Icon, Dropdown } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { When } from 'react-if'

import {
	Container,
	Required,
	Title,
	useFieldDropdownProps,
	useFieldWellStyles,
	useResetButtonProps,
	Well,
} from './FieldWell.styles.js'
import type { FieldWellProps } from './FieldWell.types.js'

export const FieldWell: React.FC<FieldWellProps> = memo(function FieldWell({
	title,
	placeholder,
	icon,
	required,
	selectedKey,
	options,
	onChange,
	onReset,
	styles,
}) {
	const _styles = useFieldWellStyles(styles)
	const dropdownDisabled = !options || options.length === 0
	const dropdownProps = useFieldDropdownProps(_styles.dropdown)

	const resetDisabled = selectedKey === undefined
	const resetProps = useResetButtonProps(resetDisabled)
	const handleChange = useCallback(
		(_e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) =>
			onChange?.(option?.key as string),
		[onChange],
	)

	return (
		<Container style={_styles.root}>
			<Title style={_styles.title}>
				{title}
				<Required required={required} style={_styles.required} />
			</Title>
			<Well style={_styles.well}>
				<Icon iconName={icon} styles={_styles.icon} />
				<Dropdown
					onClick={(e) => e.stopPropagation()}
					disabled={dropdownDisabled}
					options={options || []}
					placeholder={dropdownDisabled ? '(No valid options)' : placeholder}
					onChange={handleChange}
					selectedKey={selectedKey || null}
					{...dropdownProps}
				/>
				<When condition={onReset !== undefined}>
					<IconButton
						{...resetProps}
						disabled={resetDisabled}
						onClick={onReset}
					/>
				</When>
			</Well>
		</Container>
	)
})
