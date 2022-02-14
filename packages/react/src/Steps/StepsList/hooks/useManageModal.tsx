/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'

export function useManageModal(): {
	hideTableModal: () => void
	toggleDuplicatingStep: () => void
	showTableModal: () => void
	isTableModalOpen: boolean
	isDuplicatingStep: boolean
} {
	const [
		isTableModalOpen,
		{ setTrue: showTableModal, setFalse: hideTableModal },
	] = useBoolean(false)
	const [isDuplicatingStep, { toggle: toggleDuplicatingStep }] =
		useBoolean(false)

	return {
		hideTableModal,
		isTableModalOpen,
		showTableModal,
		isDuplicatingStep,
		toggleDuplicatingStep,
	}
}
