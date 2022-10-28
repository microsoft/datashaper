/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'

export interface CommandBarContainerProps {
	props: IDetailsColumnProps
	renderers: IRenderFunction<IDetailsColumnProps>[]
}
