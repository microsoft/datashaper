/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconProps } from '@fluentui/react'
import { Icon, IconButton, useTheme } from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import { memo, useMemo } from 'react'

import {
	Container,
	Content,
	Header,
	Title,
	TitleContainer,
} from './ToolPanel.styles.js'
import type { ToolPanelProps } from './ToolPanel.types.js'

export const ToolPanel: React.FC<React.PropsWithChildren<ToolPanelProps>> =
	memo(function ToolPanel({
		onDismiss,
		headerText = 'History',
		headerIconProps,
		hasCloseButton = true,
		closeIconProps,
		styles,
		children,
	}) {
		const closeProps = useCloseIconProps(closeIconProps)
		return (
			<Container style={styles?.root}>
				<Header style={styles?.header}>
					<TitleContainer>
						{headerIconProps && <Icon {...headerIconProps} />}
						<Title style={styles?.title}>{headerText}</Title>
					</TitleContainer>
					{hasCloseButton && (
						<IconButton
							iconProps={closeProps}
							onClick={onDismiss}
							ariaLabel="Close"
						/>
					)}
				</Header>
				<Content style={styles?.content}>{children}</Content>
			</Container>
		)
	})

function useCloseIconProps(overrides?: IIconProps) {
	const theme = useTheme()
	return useMemo(
		() =>
			merge(
				{
					iconName: 'Cancel',
					styles: {
						root: {
							color: theme.palette.neutralPrimary,
						},
					},
				},
				overrides,
			),
		[theme, overrides],
	)
}
