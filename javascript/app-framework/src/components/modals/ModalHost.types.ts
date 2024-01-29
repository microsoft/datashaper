/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ModalHostProps extends React.PropsWithChildren {
	title: string
	isOpen: boolean
	onDismiss: () => void
}
