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
	onSelectDate: (date: Date) => void,
	disabled: boolean,
	cleanLabel: boolean
}

const iconClass = mergeStyles({
	fontSize: 20,
	height: 25,
	width: 25,
	margin: '0 25px'
})

export const CalendarPicker: React.FC<CalendarPickerProps> = memo(
	function CalendarPicker({ onSelectDate, disabled, cleanLabel }) {
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
			<Container>
				<CalendarContainer ref={buttonContainerRef}>
					<CalendarButton
						aria-label="Compass"
						iconName="Calendar"
						className={iconClass}
						onClick={!disabled ? toggleShowCalendar: undefined}
						style={disabled ? {cursor: 'default', color: 'rgb(118, 118, 118)'} : {cursor: 'pointer', color: 'rgb(241, 241, 241)'}}
					/>
					{selectedDate !== undefined && !cleanLabel ? (
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

const Container = styled.div`
	display: inline;
`

const CalendarContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const CalendarButton = styled(FontIcon)`
	display: inline;
	float: left;
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 0px;
`

const CalendarLabel = styled(Label)`
	display: inline;
	float: left;
	margin-left: 10px;
`
