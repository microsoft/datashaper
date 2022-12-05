/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IButtonStyles,
	IIconProps,
	IProcessedStyleSet,
} from '@fluentui/react'
import { FontWeights, mergeStyleSets, useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useContentStyles(): IProcessedStyleSet<{
	container: any
	header: any
	body: any
}> {
	const theme = useTheme()
	return useMemo(
		() =>
			mergeStyleSets({
				container: {
					display: 'flex',
					flexFlow: 'column nowrap',
					alignItems: 'stretch',
				},
				header: [
					theme.fonts.xLargePlus,
					{
						flex: '1 1 auto',
						borderTop: `4px solid ${theme.palette.themePrimary}`,
						color: theme.palette.neutralPrimary,
						display: 'flex',
						alignItems: 'center',
						fontWeight: FontWeights.semibold,
						padding: '12px 12px 14px 24px',
					},
				],
				body: {
					flex: '4 4 auto',
					padding: '0 24px 24px 24px',
					overflowY: 'hidden',
					selectors: {
						p: { margin: '14px 0' },
						'p:first-child': { marginTop: 0 },
						'p:last-child': { marginBottom: 0 },
					},
				},
			}),
		[theme],
	)
}

export function useIconButtonStyles(): Partial<IButtonStyles> {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				color: theme.palette.neutralPrimary,
				marginLeft: 'auto',
				marginTop: '4px',
				marginRight: '2px',
			},
			rootHovered: {
				color: theme.palette.neutralDark,
			},
		}),
		[theme],
	)
}
export const buttonRowStyle: React.CSSProperties = {
	marginTop: 5,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-end',
}
export const okButtonStyle = { marginRight: 5 }
export const cancelIcon: IIconProps = { iconName: 'Cancel' }
