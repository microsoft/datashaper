/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ButtonChoiceGroup } from '@essex/components'
import { memo } from 'react'

import { ViewOptionsContainer } from './ViewOptions.styles.js'
import type { ViewOptionsProps } from './ViewOptions.types.js'

export const ViewOptions: React.FC<ViewOptionsProps> = memo(
	function ViewOptions({ options, selectedKey, onChange }) {
		return (
			<ViewOptionsContainer>
				<ButtonChoiceGroup
					options={options}
					selectedKey={selectedKey}
					onChange={(_, option) => onChange(option!.key)}
				/>
			</ViewOptionsContainer>
		)
	},
)
