/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const tick = (): Promise<void> => new Promise(r => setTimeout(r, 0))
