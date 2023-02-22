/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Icon, Dropdown } from '@fluentui/react'
import { memo, useCallback } from 'react'

import {
	Container,
	Required,
	Title,
	useFieldDropdownProps,
	useFieldWellStyles,
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
	styles,
}) {
	const _styles = useFieldWellStyles(styles)
	const dropdownProps = useFieldDropdownProps(_styles.dropdown)

	const handleChange = useCallback(
		(_e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) =>
			onChange?.((option?.key as string) || ''),
		[onChange],
	)
	const disabled = !options || options.length === 0
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
					disabled={disabled}
					options={options || []}
					placeholder={disabled ? '(No valid options)' : placeholder}
					onChange={handleChange}
					selectedKey={selectedKey}
					{...dropdownProps}
				/>
			</Well>
		</Container>
	)
})
