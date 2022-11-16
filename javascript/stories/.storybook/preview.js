/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { addDecorator } from '@storybook/react'
import { loadCSV } from 'arquero'

import { ThematicFluentDecorator } from './ThematicFluentDecorator.js'

addDecorator(ThematicFluentDecorator)

export const loaders = [
	async () => ({
		companies: await loadCSV('./data/companies.csv'),
		companiesRaw: await loadCSV('./data/companies.csv', { autoType: false }),
		companies2: await loadCSV('./data/companies2.csv'),
		products: await loadCSV('./data/products.csv'),
		stocks: await loadCSV('./data/stocks.csv'),
	}),
]
