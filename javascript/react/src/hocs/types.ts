/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type HOCFunction<T> = (Component: React.FC<T>) => React.FC<T>
