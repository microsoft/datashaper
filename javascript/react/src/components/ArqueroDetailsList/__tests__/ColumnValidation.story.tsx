/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationResult } from '@datashaper/schema'
import { generateCodebook, introspect, validateTable } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'

export const ColumnValidationStory: ComponentStory<typeof ArqueroDetailsList> =
	(
		args: ArqueroDetailsListProps,
		{ loaded: { companiesRaw } }: any,
	): JSX.Element => {
		const codebookResult = generateCodebook(companiesRaw)
		const metadata = introspect(companiesRaw, true)
		// inject a few constraints to test & render
		let found = codebookResult.fields.find((e) => e.name === 'ID')
		found.constraints = {
			required: true,
			unique: true,
			minimum: 2,
			maximum: 3,
		}

		found = codebookResult.fields.find((e) => e.name === 'Name')
		found.constraints = {
			enum: ['Microsoft', 'Apple', 'Google'],
		}

		found = codebookResult.fields.find((e) => e.name === 'Employees')
		found.constraints = { minimum: 160000 }

		const validationResult: ValidationResult = validateTable(
			companiesRaw,
			codebookResult,
			false,
		)

		return (
			<ArqueroDetailsList
				features={{
					smartCells: true,
				}}
				{...args}
				table={companiesRaw}
				metadata={metadata}
				validationResult={validationResult}
			/>
		)
	}
ColumnValidationStory.storyName = 'Column validation'
