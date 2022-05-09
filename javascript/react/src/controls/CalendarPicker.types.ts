/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface CalendarPickerProps {
	onSelectDate: (date: Date) => void
	disabled: boolean
	cleanLabel: boolean
}
