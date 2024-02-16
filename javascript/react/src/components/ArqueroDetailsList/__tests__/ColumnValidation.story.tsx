/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Constraints, ValidationResult } from '@datashaper/schema'
import { generateCodebook, introspect, validateTable } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'
import { useEffect, useState } from 'react'

export const ColumnValidationStory: ComponentStory<typeof ArqueroDetailsList> =
	(
		args: ArqueroDetailsListProps,
		{ loaded: { companiesRaw } }: any,
	): JSX.Element => {
		const [codebook, setCodebook] = useState<CodebookSchema>()
		useEffect(() => {
			const f = async () => setCodebook(await generateCodebook(companiesRaw))
			f()
		}, [companiesRaw])
		
		const metadata = introspect(companiesRaw, true)

		// inject a few constraints to test & render
		enrichField(codebook, 'ID', {
			required: true,
			unique: true,
			minimum: 2,
			maximum: 3,
		})
		enrichField(codebook, 'Name',{
			enum: ['Microsoft', 'Apple', 'Google'],
		})
		enrichField(codebook, 'Employees', { minimum: 160000 })

		const [validationResult, setValidationResult] = useState<ValidationResult>()
		useEffect(() => {
			if (codebook) {
				setValidationResult(validateTable(
					companiesRaw,
					codebook,
					false,
				))
			}
		}, [companiesRaw, codebook])
		

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

function enrichField(codebook: CodebookSchema | undefined, name: string, constraints: Constraints) {
	const found = codebook?.fields?.find((e) => e.name === name)
	if (found) {
		found.constraints = constraints
	}
}