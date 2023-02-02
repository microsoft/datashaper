/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface LanguageEditorProps {
	content?: string
	language?: string
	onChange: (content: string | undefined) => void
}
