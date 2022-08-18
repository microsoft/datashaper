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
	OnehotArgs,
	OrderbyArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SpreadArgs,
	UnfoldArgs,
	UnhotArgs,
	UnrollArgs,
	Verb,
	WindowArgs,
} from './verbs.js'

export type PortBinding = string | NamedPortBinding
export type OutputPortBinding = string | NamedOutputPortBinding

/**
 * An explicit step input binding
 */
export interface NamedPortBinding {
	/**
	 * The id of the node to bind to
	 */
	node: string

	/**
	 * The named output of the node to bind with. If not defined, this will
	 * be the default output "target"
	 */
	output?: string
}

/**
 * An explicit workflow output
 */
export interface NamedOutputPortBinding extends NamedPortBinding {
	/**
	 * The output table name
	 */
	name: string
}

/**
 * The root wrangling workflow specification. (Used for generating JSON Schema)
 */
export interface WorkflowJson {
	/**
	 * The schema url of the specification
	 */
	$schema?: string
	/**
	 * The name of the specification
	 */
	name?: string

	/**
	 * A user-friendly description of the specification
	 */
	description?: string

	/**
	 * The workflow steps
	 */
	steps?: StepJson[]

	/**
	 * A list of input names that are expected to be provided in addition to the workflow steps
	 */
	input?: string[]

	/**
	 * The output bindings
	 */
	output: Array<OutputPortBinding>
}

/**
 * Specification for step items
 */
export type StepJson = StepJsonCommon &
	(
		| ({ verb: Verb.Aggregate; args?: AggregateArgs } & BasicInput)
		| ({ verb: Verb.Bin; args?: BinArgs } & BasicInput)
		| ({ verb: Verb.Binarize; args?: BinarizeArgs } & BasicInput)
		| ({ verb: Verb.Boolean; args?: BooleanArgs } & BasicInput)
		| ({ verb: Verb.Concat } & VariadicInput)
		| ({ verb: Verb.Convert; args?: ConvertArgs } & BasicInput)
		| ({ verb: Verb.Dedupe; args?: DedupeArgs } & BasicInput)
		| ({ verb: Verb.Derive; args?: DeriveArgs } & BasicInput)
		| ({ verb: Verb.Difference } & VariadicInput)
		| ({ verb: Verb.Erase; args?: EraseArgs } & BasicInput)
		| ({ verb: Verb.Fetch; args?: FetchArgs } & BasicInput)
		| ({ verb: Verb.Fill; args?: FillArgs } & BasicInput)
		| ({ verb: Verb.Filter; args?: FilterArgs } & BasicInput)
		| ({ verb: Verb.Fold; args?: FoldArgs } & BasicInput)
		| ({ verb: Verb.Groupby; args?: GroupbyArgs } & BasicInput)
		| ({ verb: Verb.Impute; args?: ImputeArgs } & BasicInput)
		| ({ verb: Verb.Intersect } & VariadicInput)
		| ({ verb: Verb.Join; args?: JoinArgs } & DualInput)
		| ({ verb: Verb.Lookup; args?: LookupArgs } & DualInput)
		| ({ verb: Verb.Merge; args?: MergeArgs } & BasicInput)
		| ({ verb: Verb.Onehot; args?: OnehotArgs } & BasicInput)
		| ({ verb: Verb.Orderby; args?: OrderbyArgs } & BasicInput)
		| ({ verb: Verb.Pivot; args?: PivotArgs } & BasicInput)
		| ({ verb: Verb.Recode; args?: RecodeArgs } & BasicInput)
		| ({ verb: Verb.Rename; args?: RenameArgs } & BasicInput)
		| ({ verb: Verb.Rollup; args?: RollupArgs } & BasicInput)
		| ({ verb: Verb.Sample; args?: SampleArgs } & BasicInput)
		| ({ verb: Verb.Select; args?: SelectArgs } & BasicInput)
		| ({ verb: Verb.Spread; args?: SpreadArgs } & BasicInput)
		| ({ verb: Verb.Unfold; args?: UnfoldArgs } & BasicInput)
		| ({ verb: Verb.Ungroup } & BasicInput)
		| ({ verb: Verb.Unhot; args?: UnhotArgs } & BasicInput)
		| ({ verb: Verb.Union } & VariadicInput)
		| ({ verb: Verb.Unorder } & BasicInput)
		| ({ verb: Verb.Unroll; args?: UnrollArgs } & BasicInput)
		| ({ verb: Verb.Window; args?: WindowArgs } & BasicInput)
	)

/**
 * Common step properties
 */
export interface StepJsonCommon {
	/**
	 * A unique identifier for this step
	 */
	id?: string
}

/**
 * Single-input, single-output step I/O
 */
export interface BasicInput {
	/**
	 * Standard step input; single source with default name "source".
	 *
	 * If undefined, the default output of the previous step will be used (if available).
	 * If no previous step is available, this will remain undefined
	 */
	input?: string | { source: PortBinding }
}

/**
 * Dual-input, single-output step I/O
 */
export interface DualInput extends BasicInput {
	/**
	 * The inputs that must be bound; "source" & "other".
	 */
	input: {
		/**
		 * The primary input, which must be specified
		 */
		source: PortBinding

		/**
		 * The secondary input, which must be specified
		 */
		other: PortBinding
	}
}

/**
 * Multi-input, single output step I/O
 */
export interface VariadicInput extends BasicInput {
	/**
	 * The step inputs; a required "source" and optional, variadic "others". If this is a
	 * string, it is used to bind the primary input.
	 */
	input: {
		/**
		 * The primary input
		 */
		source: PortBinding

		/**
		 * The variadic secondary inputs
		 */
		others?: PortBinding[]
	}
}
