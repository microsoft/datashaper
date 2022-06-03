import { addDecorator } from '@storybook/react'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'

addDecorator(ThematicFluentDecorator)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}