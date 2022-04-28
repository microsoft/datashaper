import { memo, useMemo, Fragment } from 'react'
import { Dropdown, IDropdownOption } from '@fluentui/react'
import { Switch, Case } from 'react-if'
import { useDropdownChangeHandler } from './hooks.js'
import type { StepChangeFunction } from '../types.js'
import type { Step } from '@data-wrangling-components/core'

export interface FormInputBase {
	/**
	 * The user-friendly form label
	 */
	label: string

	/**
	 * The placeholder text to show
	 */
	placeholder?: string

	/**
	 * Whether this input is required
	 */
	required?: boolean

	/**
	 * Whether this input is presented
	 */
	condition?: boolean

	/**
	 * An optional React component to wrap the input with
	 */
	wrapper?: React.ComponentType
}

export interface SingleChoiceFormInput<T> extends FormInputBase {
	type: FormInputType.SingleChoice

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: number | string

	onChange: (step: Step<T>, optionKey: string | number | undefined) => void
}

export type FormInput<T> = SingleChoiceFormInput<T>

export enum FormInputType {
	SingleChoice = 'enum',
	String = 'string',
	Number = 'number',
	Boolean = 'boolean',
}

export const VerbInput: React.FC<{
	inputs: FormInput<any>[]
	step: Step<any>
	onChange?: StepChangeFunction<any>
}> = memo(function VerbInput({ inputs, step, onChange }) {
	const rows = useMemo(
		() =>
			inputs.map((input, index) => (
				<Input
					input={input}
					step={step}
					onChange={onChange}
					key={`verb-${input.label}-${index}`}
				/>
			)),
		[inputs],
	)
	return <>{rows}</>
})

const Input: React.FC<{
	input: FormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function Input({ input, step, onChange }) {
	const condition = input.condition ?? true
	const inputType: FormInputType = input.type

	return condition == false ? null : (
		<Switch>
			<Case condition={inputType == FormInputType.SingleChoice}>
				<SingleChoiceInput
					input={input as SingleChoiceFormInput<unknown>}
					step={step}
					onChange={onChange}
				/>
			</Case>
		</Switch>
	)
})

const SingleChoiceInput: React.FC<{
	input: SingleChoiceFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function SingleChoiceInput({
	step,
	input: {
		label,
		placeholder,
		current,
		required,
		options,
		wrapper: Wrapper = Fragment,
		onChange: updater,
	},
	onChange,
}) {
	const dropdownChangeHandler = useDropdownChangeHandler(
		step,
		updater,
		onChange,
	)
	return (
		<Wrapper>
			<Dropdown
				required={required}
				label={label}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKey={current as number | string}
				options={options!}
				onChange={dropdownChangeHandler}
			/>
		</Wrapper>
	)
})

const dropdownStyles = {
	root: {
		width: 220,
	},
}
