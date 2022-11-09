import { addDecorator } from '@storybook/react'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'
import { loadCSV } from 'arquero'

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
