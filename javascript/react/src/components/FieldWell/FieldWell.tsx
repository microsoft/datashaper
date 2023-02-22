/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback } from 'react'

import {
	Container,
	Required,
	StyledIcon,
	Title,
	useFieldDropdownProps,
	Well,
} from './FieldWell.styles.js'
import type { FieldWellProps } from './FieldWell.types.js'

export const FieldWell: React.FC<FieldWellProps> = memo(function FieldWell({
	field,
}) {
	const dropdownProps = useFieldDropdownProps()
	const { title, placeholder, icon, required, selectedKey, options } = field

	const handleChange = useCallback(
		(_e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) =>
			field.onChange?.((option?.key as string) || ''),
		[field],
	)
	const disabled = !options || options.length === 0
	return (
		<Container>
			<Title>
				{title}
				<Required required={required} />
			</Title>
			<Well>
				<StyledIcon iconName={icon} />
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
