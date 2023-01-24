/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface HelpPanelProps {
	onToggleExpanded: () => void
	currentHelp?: string
	helpContent: Record<string, string>
}
