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
	InputColumnListArgs,
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
	Verb,
	WindowArgs,
} from '../verbs/index.js'

export type InputBinding = { node: string; output?: string }

export interface StepSpecification<T extends object = any> {
	/**
	 * A unique identifier for this step
	 */
	id?: string

	/**
	 * helpful for documentation in JSON specs
	 */
	description?: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args?: T

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	inputs?:
		| string
		| ({
				others?: (string | InputBinding)[]
		  } & Record<string, string | InputBinding>)

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	outputs?: string | Record<string, string>
}

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
	inputs: {
		others?: InputBinding[]
	} & Record<string, InputBinding>

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	outputs: Record<string, string>
}

export interface Specification {
	name?: string
	description?: string
	steps?: StepSpecification[]
}

export type AggregateStep = Step<AggregateArgs>
export type BinStep = Step<BinArgs>
export type BinarizeStep = Step<BinarizeArgs>
export type BooleanStep = Step<BooleanArgs>
export type ColumnListStep = Step<InputColumnListArgs>
export type ConvertStep = Step<ConvertArgs>
export type DedupeStep = Step<DedupeArgs>
export type DeriveStep = Step<DeriveArgs>
export type EraseStep = Step<EraseArgs>
export type ImputeStep = Step<ImputeArgs>
export type FetchStep = Step<FetchArgs>
export type FillStep = Step<FillArgs>
export type FilterStep = Step<FilterArgs>
export type FoldStep = Step<FoldArgs>
export type GroupbyStep = Step<GroupbyArgs>
export type JoinStep = Step<JoinArgs>
export type LookupStep = Step<LookupArgs>
export type MergeStep = Step<MergeArgs>
export type OneHotStep = Step<OneHotArgs>
export type PivotStep = Step<PivotArgs>
export type OrderbyStep = Step<OrderbyArgs>
export type RecodeStep = Step<RecodeArgs>
export type RenameStep = Step<RenameArgs>
export type RollupStep = Step<RollupArgs>
export type SampleStep = Step<SampleArgs>
export type SelectStep = Step<SelectArgs>
export type SpreadStep = Step<SpreadArgs>
export type UnfoldStep = Step<UnfoldArgs>
export type UnrollStep = Step<UnrollArgs>
export type WindowStep = Step<WindowArgs>
