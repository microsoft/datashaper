/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Calendar,
	Callout,
	defaultCalendarStrings,
	DirectionalHint,
	FocusTrapZone,
	useTheme,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useMemo, useRef, useState } from 'react'

import {
	CalendarButton,
	CalendarContainer,
	CalendarLabel,
	Container,
	iconClass,
} from './CalendarPicker.styles.js'
import type { CalendarPickerProps } from './CalendarPicker.types.js'

export const CalendarPicker: React.FC<CalendarPickerProps> = memo(
	function CalendarPicker({ onSelectDate, value, disabled, cleanLabel }) {
		const [selectedDate, setSelectedDate] = useState<Date>(value ?? new Date())
		const [
			showCalendar,
			{ toggle: toggleShowCalendar, setFalse: hideCalendar },
		] = useBoolean(false)
		const buttonContainerRef = useRef<HTMLDivElement>(null)

		const onSelectDateChange = useCallback(
			(date: Date): void => {
				setSelectedDate(date)
				hideCalendar()
			},
			[hideCalendar],
		)

		const theme = useTheme()
		const iconColors = useMemo(
			() => ({
				disabled: theme.palette.neutralTertiary,
				enabled: theme.palette.neutralPrimary,
			}),
			[theme],
		)

		return (
			<Container>
				<CalendarContainer ref={buttonContainerRef}>
					<CalendarButton
						aria-label="Compass"
						iconName="Calendar"
						className={iconClass}
						onClick={!disabled ? toggleShowCalendar : undefined}
						style={
							disabled
								? { cursor: 'default', color: iconColors.disabled }
								: { cursor: 'pointer', color: iconColors.enabled }
						}
					/>
					{selectedDate != null && !cleanLabel ? (
						<CalendarLabel>
							{!cleanLabel ? selectedDate?.toLocaleDateString() : ''}
						</CalendarLabel>
					) : null}
				</CalendarContainer>
				{showCalendar && (
					<Callout
						isBeakVisible={false}
						gapSpace={0}
						doNotLayer={false}
						target={buttonContainerRef}
						directionalHint={DirectionalHint.bottomLeftEdge}
						onDismiss={hideCalendar}
						setInitialFocus
					>
						<FocusTrapZone isClickableOutsideFocusTrap>
							<Calendar
								onDismiss={hideCalendar}
								showMonthPickerAsOverlay
								highlightSelectedMonth
								showGoToToday={false}
								onSelectDate={(date: Date) => {
									onSelectDate(date)
									onSelectDateChange(date)
								}}
								value={selectedDate}
								// Calendar uses English strings by default. For localized apps, you must override this prop.
								strings={defaultCalendarStrings}
							/>
						</FocusTrapZone>
					</Callout>
				)}
			</Container>
		)
	},
)
