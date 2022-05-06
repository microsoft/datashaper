/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo, useState } from 'react'

export interface ModalState {
	/**
	 * Whether the modal is open or not
	 */
	isOpen: boolean

	/**
	 * A callback to present the modal
	 */
	show(): void

	/**
	 * A callback to hide the modal
	 * */
	hide(): void

	/**
	 * A callback to toggle modol visibility
	 */
	toggle(): void
}

/**
 * A hook to consolidate view-state for modals
 *
 * @param onHide - callback to be called when the modal is dismissed
 * @returns The modal state
 */
export function useModalState(
	onShow?: (() => void) | undefined,
	onHide?: (() => void) | undefined,
): ModalState {
	const [isOpen, setIsOpen] = useState(false)
	const open = useCallback(() => setIsOpen(true), [setIsOpen])
	const close = useCallback(() => setIsOpen(false), [setIsOpen])

	/**
	 * Shw logic
	 */
	const show = useCallback(() => {
		onShow?.()
		open()
	}, [onShow, open])

	/**
	 * Hide logic
	 */
	const hide = useCallback(() => {
		close()
		onHide?.()
	}, [close, onHide])

	/**
	 * Toggle logic
	 */
	const toggle = useCallback(
		() => (isOpen ? hide() : show()),
		[isOpen, hide, show],
	)

	return useMemo(
		() => ({
			isOpen,
			show,
			hide,
			toggle,
		}),
		[isOpen, show, hide, toggle],
	)
}
