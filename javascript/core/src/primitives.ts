/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Maybe<T> = T | undefined

/**
 * Function callback for general activity listener.
 */
export type Handler = () => void

export type HandlerOf<T> = (input: T) => void

export type Unsubscribe = Handler
