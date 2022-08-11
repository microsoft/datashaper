import { addDecorator } from '@storybook/react'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'
import { loadCSV } from 'arquero'

addDecorator(ThematicFluentDecorator)

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

export const loaders = [
	async () => ({
		stocks: await loadCSV('./data/stocks.csv', {
			autoMax: 1000000,
		}),
	}),
]
