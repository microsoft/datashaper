/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DefaultButton,
	DialogType,
	Dialog,
	DialogFooter,
	PrimaryButton,
} from '@fluentui/react'
import { memo, useMemo } from 'react'

//TODO: move to essex js toolkit?
export const DialogConfirm: React.FC<{
	toggle: () => void
	onConfirm: () => void
	show?: boolean
	title: string
	subText?: string
}> = memo(function DialogConfirm({ toggle, onConfirm, show, title, subText }) {
	const dialogContentProps = useMemo(
		() => ({ type: DialogType.normal, title, subText }),
		[title, subText],
	)
	return (
		<Dialog
			dialogContentProps={dialogContentProps}
			hidden={!show}
			onDismiss={toggle}
		>
			<DialogFooter>
				<PrimaryButton onClick={onConfirm} text="Yes" />
				<DefaultButton onClick={toggle} text="No" />
			</DialogFooter>
		</Dialog>
	)
})
