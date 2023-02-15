/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback } from 'react'
import type { ProfileFieldWell } from '../../../types.js'

import {
	Container,
	FieldContainer,
	Required,
	StyledIcon,
	Title,
	useFieldDropdownProps,
	Well,
} from './FieldWells.styles.js'
import type { FieldWellsProps } from './FieldWells.types.js'

export const FieldWells: React.FC<FieldWellsProps> = memo(function FieldWells({
	fields,
}) {
	return (
		<Container>
			{fields.map((field) => {
				return <FieldWell key={`field-well-${field.key}`} field={field} />
			})}
		</Container>
	)
})

interface FieldWellProps {
	field: ProfileFieldWell
}

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
		<FieldContainer>
			<Title>
				{title}
				<Required required={required} />
			</Title>
			<Well>
				<StyledIcon iconName={icon} />
				<Dropdown
					disabled={disabled}
					options={options || []}
					placeholder={disabled ? '(No valid options)' : placeholder}
					onChange={handleChange}
					selectedKey={selectedKey}
					{...dropdownProps}
				/>
			</Well>
		</FieldContainer>
	)
})
