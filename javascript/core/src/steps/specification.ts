/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AggregateArgs,
	BinArgs,
	BinarizeArgs,
	BooleanArgs,
	ConvertArgs,
	DedupeArgs,
	DeriveArgs,
	EraseArgs,
	FetchArgs,
	FillArgs,
	FilterArgs,
	FoldArgs,
	GroupbyArgs,
	ImputeArgs,
	JoinArgs,
	LookupArgs,
	MergeArgs,
	OneHotArgs,
	OrderbyArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SpreadArgs,
	UnfoldArgs,
	UnrollArgs,
	WindowArgs,
} from '../verbs/index.js'
import type { Verb } from '../verbs/index.js'

export type InputBinding = { node: string; output?: string }

export type InputBindingSpecification = string | InputBinding

export type StepInputs =
	| string
	| ({
			others?: InputBindingSpecification[]
	  } & Record<string, InputBindingSpecification>)

export type StepOutputs = string | Record<string, string>

export interface StepCommon {
	/**
	 * A unique identifier for this step
	 */
	id?: string

	/**
	 * helpful for documentation in JSON specs
	 */
	description?: string

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input?: StepInputs

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output?: StepOutputs
}
export type StepSpecification = StepCommon &
	(
		| { verb: Verb.Aggregate; args?: AggregateArgs }
		| { verb: Verb.Bin; args?: BinArgs }
		| { verb: Verb.Binarize; args?: BinarizeArgs }
		| { verb: Verb.Boolean; args?: BooleanArgs }
		| { verb: Verb.Concat }
		| { verb: Verb.Convert; args?: ConvertArgs }
		| { verb: Verb.Dedupe; args?: DedupeArgs }
		| { verb: Verb.Difference }
		| { verb: Verb.Derive; args?: DeriveArgs }
		| { verb: Verb.Erase; args?: EraseArgs }
		| { verb: Verb.Fetch; args?: FetchArgs }
		| { verb: Verb.Fill; args?: FillArgs }
		| { verb: Verb.Filter; args?: FilterArgs }
		| { verb: Verb.Fold; args?: FoldArgs }
		| { verb: Verb.Groupby; args?: GroupbyArgs }
		| { verb: Verb.Impute; args?: ImputeArgs }
		| { verb: Verb.Intersect }
		| { verb: Verb.Join; args?: JoinArgs }
		| { verb: Verb.Lookup; args?: LookupArgs }
		| { verb: Verb.Merge; args?: MergeArgs }
		| { verb: Verb.OneHot; args?: OneHotArgs }
		| { verb: Verb.Orderby; args?: OrderbyArgs }
		| { verb: Verb.Pivot; args?: PivotArgs }
		| { verb: Verb.Recode; args?: RecodeArgs }
		| { verb: Verb.Rename; args?: RenameArgs }
		| { verb: Verb.Rollup; args?: RollupArgs }
		| { verb: Verb.Sample; args?: SampleArgs }
		| { verb: Verb.Select; args?: SelectArgs }
		| { verb: Verb.Spread; args?: SpreadArgs }
		| { verb: Verb.Unfold; args?: UnfoldArgs }
		| { verb: Verb.Union }
		| { verb: Verb.Unorder }
		| { verb: Verb.Ungroup }
		| { verb: Verb.Unroll; args?: UnrollArgs }
		| { verb: Verb.Window; args?: WindowArgs }
	)

export interface Step<T extends object = any> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args: T

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input: {
		others?: InputBinding[]
	} & Record<string, InputBinding>

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: Record<string, string>
}

export interface Specification {
	name?: string
	description?: string
	steps?: StepSpecification[]
}
