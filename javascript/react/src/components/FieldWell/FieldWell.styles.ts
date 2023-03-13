/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDropdownProps } from '@essex/components'
import type {
	IButtonProps,
	IDropdownProps,
	IDropdownStyles,
} from '@fluentui/react'
import { merge, useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'
import type { FieldWellStyles } from './FieldWell.types.js'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 0;
`

export const Title = styled.div`
	display: flex;	
	font-size: 0.8em;
	color: ${({ theme }) => theme.palette.neutralSecondary};
`

export const Required = styled.div<{ required?: boolean }>`
	color: ${({ theme }) => theme.palette.redDark};
	&:before {
		content: '${({ required }) => (required ? '*' : '')}';
	}
`

export const Well = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 4px;
	color: ${({ theme }) => theme.palette.neutralSecondary};
	border: 1px dotted ${({ theme }) => theme.palette.neutralTertiaryAlt};
	background: ${({ theme }) => theme.palette.neutralLighter};
	border-radius: 4px;
	padding: 3px 8px;
`

export function useFieldWellStyles(
	styles?: Partial<FieldWellStyles>,
): FieldWellStyles {
	const theme = useTheme()
	return useMemo(
		() =>
			merge(
				{
					dropdown: {
						root: {
							width: '100%',
							border: 'none',
						},
						dropdown: {
							border: 'none',
						},
						title: {
							background: 'none',
						},
					},
					icon: {
						root: {
							color: theme.palette.neutralPrimary,
						},
					},
				},
				styles,
			),
		[theme, styles],
	)
}

export function useFieldDropdownProps(
	dropdownStyles?: Partial<IDropdownStyles>,
): Partial<IDropdownProps> {
	return useDropdownProps({ styles: dropdownStyles }, 'small')
}

export function useResetButtonProps(disabled?: boolean): IButtonProps {
	const theme = useTheme()
	return useMemo(
		() => ({
			iconProps: {
				iconName: 'Clear',
				styles: {
					root: {
						// TODO: this should be possible declaratively with fluent props for the disabled icon state
						color: disabled
							? theme.palette.neutralTertiaryAlt
							: theme.palette.neutralPrimary,
						fontSize: 9,
					},
				},
			},
			styles: {
				root: {
					borderRadius: 0,
					padding: 0,
					margin: 0,
					width: 12,
					height: 12,
				},
			},
		}),
		[theme, disabled],
	)
}
