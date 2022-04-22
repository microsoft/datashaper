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
	FontIcon,
	Label,
	mergeStyles,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo } from 'react'
import styled from 'styled-components'

export interface CalendarPickerProps {
	onSelectDate: (date: Date) => void
}

const iconClass = mergeStyles({
	fontSize: 20,
	height: 25,
	width: 25,
	margin: '0 25px',
	cursor: 'pointer',
})

export const CalendarPicker: React.FC<CalendarPickerProps> = memo(
	function CalendarPicker({ onSelectDate }) {
		const [selectedDate, setSelectedDate] = React.useState<Date>()
		const [
			showCalendar,
			{ toggle: toggleShowCalendar, setFalse: hideCalendar },
		] = useBoolean(false)
		const buttonContainerRef = React.useRef<HTMLDivElement>(null)

		const onSelectDateChange = React.useCallback(
			(date: Date): void => {
				setSelectedDate(date)
				hideCalendar()
			},
			[hideCalendar],
		)

		return (
			<div>
				<CalendarContainer ref={buttonContainerRef}>
					<CalendarButton
						aria-label="Compass"
						iconName="Calendar"
						className={iconClass}
						onClick={toggleShowCalendar}
					/>
					{selectedDate !== undefined ? (
						<CalendarLabel>
							{selectedDate?.toLocaleDateString() || ''}
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
			</div>
		)
	},
)

const CalendarContainer = styled.div`
	display: inline;
`

const CalendarButton = styled(FontIcon)`
	display: inline;
	float: left;
	margin-left: 10px;
	margin-right: 0px;
`

const CalendarLabel = styled(Label)`
	display: inline;
	float: left;
	margin-left: 10px;
	margin-right: 10px;
`
