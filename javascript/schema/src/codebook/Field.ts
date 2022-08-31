/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType, VariableNature } from '../data.js'
import type { Named } from '../Named.js'
import type { Constraints } from './Constraints.js'
import type { FieldMetadata } from './FieldMetadata.js'

/**
 * Contains the full schema definition and metadata for a data field (usually a table column).
 * This includes the required data type, various data nature and rendering properties, potential
 * validation rules, and mappings from a data dictionary.
 */
export interface Field extends Named {
	/**
	 * Strict type of the field. Note that columns may not mix types in their rows for most of the data formats we use.
	 * Default: 'string'
	 */
	type?: DataType
	/**
	 * Describes the semantic or parsing format for the values.
	 * This is based on JSONSchema. See https://json-schema.org/draft/2020-12/json-schema-validation.html#name-vocabularies-for-semantic-c
	 * TODO: JSONSchema is pretty flexible here, and we should align with it. For example, there are standard string (uri, email, ip-address, etc.)
	 * that define known formats. However, you can also link out to any arbitrary schema that validates a data value.
	 * JSONSchema also uses the format field to describe date and time notation. Because dates are not a valid JSON type,
	 * they are represented as type = string, but format = date, time, date-time, or duration.
	 * We use the type in running code, so it seems appropriate to keep the expanded list, but maybe this can contain parsing
	 * instructions (e.g., a pattern) for converting date/time strings into values.
	 * https://json-schema.org/draft/2020-12/json-schema-validation.html#name-defined-formats
	 */
	format?: string
	/**
	 * Data nature. This is primarily applicable to numbers, which have different characters that define how we should display them in charts.
	 * default: continuous
	 * TODO: there is a large block of nature-related content in CauseDis. is some of this transient application state? how much do we need to carry in a schema?
	 */
	nature?: VariableNature
	/**
	 * QUDT code for the variable unit (i.e., meters, pounds, etc.).
	 * https://qudt.org/2.1/vocab/unit
	 */
	unit?: string
	/**
	 * Description of the unit for friendly display.
	 */
	unitDescription?: string
	/**
	 * Indicates that values are mapped inverse to typical expectation, and may need to be displayed in the opposite direction.
	 * Closely related to nature, particular for categorical ordinal values.
	 */
	inverse?: boolean
	/**
	 * Indicates that this field from the dataset should be excluded from computations and display.
	 */
	exclude?: boolean
	/**
	 * Single example of a valid data value for the field.
	 */
	example?: any
	/**
	 * This provides a mapping between cell values and some other value.
	 * Most commonly this is the core "data dictionary", whereby cell values are stored as numeric categories,
	 * and the dictionary defines textual descriptions of the actual meaning.
	 * If numeric, the keys are usually categorical ordinal or nominal.
	 * String keys are often commonly used (for example, medical data often use short alphanumeric codes to represent diagnostic strings).
	 */
	mapping?: Record<any, any>
	/**
	 * Detailed statistical metadata for the field.
	 * Also convenient way to persist so expensive recomputing can be avoided.
	 */
	metadata?: FieldMetadata
	/**
	 * Validation constraints for the values in the field to adhere to.
	 */
	constraints?: Constraints
	/**
	 * Optional descriptive tags for the field.
	 */
	tags?: string[]
}
