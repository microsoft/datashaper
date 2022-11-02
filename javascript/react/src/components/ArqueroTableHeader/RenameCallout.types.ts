/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface RenameCalloutProps {
	onSend: (name?: string) => void
	onChange: (evt: any, value?: string) => void
	editedName: string
	name?: string
}
