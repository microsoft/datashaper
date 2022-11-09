/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Constraints, ValidationResult } from '@datashaper/schema'
import { generateCodebook, validateTable } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'

export const ColumnValidationStory: ComponentStory<
	typeof ArqueroDetailsList
> = (
	args: ArqueroDetailsListProps,
	{ loaded: { companiesRaw } }: any,
): JSX.Element => {
	const codebookResult = generateCodebook(companiesRaw)
	const element = codebookResult.fields.find(element => element.name === 'ID')

	const idConstraints: Constraints = {
		required: true,
		unique: true,
		minimum: 2,
		maximum: 3,
	}

	element.constraints = idConstraints

	const element2 = codebookResult.fields.find(
		element => element.name === 'Name',
	)
	const nameConstraints: Constraints = {
		maxLength: 5,
		enum: ['Microsoft', 'Apple', 'Google'],
	}

	element2.constraints = nameConstraints

	const validationResult: ValidationResult = validateTable(
		companiesRaw,
		codebookResult,
		false,
	)

	return (
		<ArqueroDetailsList
			{...args}
			table={companiesRaw}
			validationResult={validationResult}
		/>
	)
}
