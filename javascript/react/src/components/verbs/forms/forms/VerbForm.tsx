/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { Expando } from '@essex/components'
import { memo, useMemo } from 'react'
import { Case, Switch, When } from 'react-if'

import type { StepChangeFunction } from '../../../../types.js'
import { CheckboxInput } from './CheckboxInput.js'
import type { CheckboxFormInput } from './CheckboxInput.types.js'
import { ComboBoxInput } from './ComboBoxInput.js'
import type { ComboBoxFormInput } from './ComboBoxInput.types.js'
import { MultiChoiceInput } from './MultiChoiceInput.js'
import type { MultiChoiceFormInput } from './MultiChoiceInput.types.js'
import { NumberSpinnerInput } from './NumberSpinnerInput.js'
import type { NumberSpinnerFormInput } from './NumberSpinnerInput.types.js'
import { SingleChoiceInput } from './SingleChoiceInput.js'
import type { SingleChoiceFormInput } from './SingleChoiceInput.types.js'
import { TextInput } from './TextInput.js'
import type { TextFormInput } from './TextInput.types.js'
import type { FormInput } from './types.js'
import { FormInputType } from './types.js'
import { useSortedInputs } from './VerbForm.hooks.js'
import { Container, InputsBlock, Row } from './VerbForm.styles.js'

/**
 * Generates a component for editing verbs based on declarative config.
 */
export const VerbForm: React.FC<{
	inputs: FormInput<any>[]
	step: Step<any>
	onChange?: StepChangeFunction<any>
}> = memo(function VerbInput({ inputs, step, onChange }) {
	// split the inputs into visible and expando based on the advanced flag
	const { regular, advanced, showAdvanced } = useSortedInputs(inputs)

	const regularRows = useMemo(
		() => mapInputs(regular, step, onChange),
		[regular, onChange, step],
	)
	const advancedRows = useMemo(
		() => mapInputs(advanced, step, onChange),
		[advanced, onChange, step],
	)

	return (
		<Container>
			<InputsBlock>{regularRows}</InputsBlock>
			<When condition={showAdvanced}>
				<Expando label={'Advanced'}>
					<InputsBlock>{advancedRows}</InputsBlock>
				</Expando>
			</When>
		</Container>
	)
})

function mapInputs(
	inputs: FormInput<any>[],
	step: Step<any>,
	onChange?: StepChangeFunction<any>,
) {
	return inputs.map((input, index) => (
		<Input
			input={input}
			step={step}
			onChange={onChange}
			key={`verb-${input.label}-${index}`}
		/>
	))
}

const Input: React.FC<{
	input: FormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function Input({ input, step, onChange }) {
	const condition = input.if ?? true
	const inputType: FormInputType = input.type

	return !condition ? null : (
		<Row>
			<Switch>
				<Case condition={inputType === FormInputType.SingleChoice}>
					<SingleChoiceInput
						input={input as SingleChoiceFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.MultiChoice}>
					<MultiChoiceInput
						input={input as MultiChoiceFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.NumberSpinner}>
					<NumberSpinnerInput
						input={input as NumberSpinnerFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.Checkbox}>
					<CheckboxInput
						input={input as CheckboxFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.Text}>
					<TextInput
						input={input as TextFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.ComboBox}>
					<ComboBoxInput
						input={input as ComboBoxFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
			</Switch>
		</Row>
	)
})
