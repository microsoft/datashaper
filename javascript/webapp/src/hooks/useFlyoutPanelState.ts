/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'

export function useFlyoutPanelState(): [
	boolean,
	// open
	() => void,
	// dismiss
	() => void,
	// toggle
	() => void,
] {
	const [isOpen, { setTrue, setFalse, toggle }] = useBoolean(false)
	return [isOpen, setTrue, setFalse, toggle]
}
