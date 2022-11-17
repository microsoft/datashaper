/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Checkbox, Label, TextField } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useTextChange } from './CodebookFieldEditor.hooks.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'

export const MappingField: React.FC<CodebookFieldEditorProps> = memo(
	function MappingField({ field, showInlineLabel, onChange }) {
		const [values, setValues] = useState(field.mapping)
		const [adding, setAdding] = useState<
			{ value: string; display: string } | undefined
		>()

		const onAddField = useCallback(() => {
			if (!adding?.value || !adding?.display) return
			const newValues = {
				...values,
				[adding.value]: adding.display,
			}
			setValues(newValues)
			onChange({ ...field, mapping: newValues })
			setAdding(undefined)
		}, [adding, values, onChange, field, setAdding])

		const onChangeField = useCallback(
			(val: any) => {
				setAdding({ ...adding, ...val })
			},
			[adding, setAdding],
		)
		const onTextChange = useTextChange(onChangeField)

		const onChangeKey = useCallback(
			(va: number, value?: any | undefined) => {
				if (!values || !value) return
				let newValues: Record<any, any> = {}
				Object.keys(values).forEach((v: any) => {
					if (va === v) {
						newValues = { ...newValues, [value]: values[v] }
					} else {
						newValues = { ...newValues, [v]: values[v] }
					}
				})
				setValues(newValues)
				onChange({ ...field, mapping: newValues })
			},
			[onChange, setValues, field, values],
		)
		const onChangeDisplay = useCallback(
			(va: number, value?: string | undefined) => {
				if (!values) return
				let newValues: Record<any, any> = {}
				Object.keys(values).forEach((v: any) => {
					if (va === v) {
						newValues = { ...newValues, [v]: value }
					} else {
						newValues = { ...newValues, [v]: values[v] }
					}
				})
				setValues(newValues)
				onChange({ ...field, mapping: newValues })
			},
			[onChange, setValues, field, values],
		)
		const onChangeNull = useCallback(
			(va: number, boolean = false) => {
				if (!values) return
				let newValues: Record<any, any> = {}
				Object.keys(values).forEach((v: any) => {
					if (va === v) {
						const value = boolean ? null : ''
						newValues = { ...newValues, [v]: value }
					} else {
						newValues = { ...newValues, [v]: values[v] }
					}
				})
				setValues(newValues)
				onChange({ ...field, mapping: newValues })
			},
			[onChange, setValues, field, values],
		)

		return (
			<FlexColumn className="field">
				{showInlineLabel ? (
					<Label disabled={field.exclude}>Mapping</Label>
				) : null}
				{values &&
					Object.keys(values).map((v: any, index: number) => (
						<MappingContainer key={index}>
							<FlexColumn style={{ flex: 1 }}>
								{index === 0 && (
									<Label
										disabled={field.exclude}
										style={{ paddingTop: 'unset' }}
									>
										Value
									</Label>
								)}
								<TextField
									disabled={field.exclude}
									name="value"
									value={v}
									onChange={(_, val) => onChangeKey(v, val)}
								/>
							</FlexColumn>
							<FlexColumn style={{ flex: 2 }}>
								{index === 0 && (
									<Label
										disabled={field.exclude}
										style={{ paddingTop: 'unset' }}
									>
										Display
									</Label>
								)}
								<TextField
									disabled={field.exclude || values[v] === null}
									name="display"
									value={values[v] ?? ''}
									onChange={(_, val) => onChangeDisplay(v, val)}
								/>
							</FlexColumn>
							<FlexColumn style={{ flex: 1 }}>
								{index === 0 && (
									<Label style={{ paddingTop: 'unset' }}>Null</Label>
								)}
								<Checkbox
									onChange={(_, val) => onChangeNull(v, val)}
									disabled={field.exclude}
								/>
							</FlexColumn>
						</MappingContainer>
					))}
				<MappingContainer>
					<FlexColumn style={{ flex: 1 }}>
						{!values && (
							<Label disabled={field.exclude} style={{ paddingTop: 'unset' }}>
								Value
							</Label>
						)}
						<TextField
							disabled={field.exclude}
							name="value"
							value={adding?.value ?? ''}
							onChange={onTextChange}
						/>
					</FlexColumn>
					<FlexColumn style={{ flex: 2 }}>
						{!values && (
							<Label disabled={field.exclude} style={{ paddingTop: 'unset' }}>
								Display
							</Label>
						)}
						<TextField
							disabled={field.exclude}
							name="display"
							value={adding?.display ?? ''}
							onChange={onTextChange}
						/>
					</FlexColumn>
					<FlexColumn style={{ flex: 1, alignSelf: 'self-end' }}>
						<ActionButton
							disabled={!adding?.value || !adding?.display}
							onClick={onAddField}
						>
							Add
						</ActionButton>
					</FlexColumn>
				</MappingContainer>
			</FlexColumn>
		)
	},
)

const Flex = styled.div`
	display: flex;
`

const MappingContainer = styled(Flex)`
	column-gap: 5px;
`
const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 5px;
`
