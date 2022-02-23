/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import Markdown from 'markdown-to-jsx'
import React, {
	memo,
	useMemo,
	useState,
	useRef,
	useEffect,
	useCallback,
} from 'react'
import styled from 'styled-components'
import { useGuidance } from './hooks.js'

interface Props {
	name: string
}

export const Guidance: React.FC<Props> = memo(function Guidance({ name = '' }) {
	const markdownContainer = useRef<HTMLDivElement>(null)
	const guidance = useGuidance()
	const [_name, setName] = useState<string[]>([name])

	if (name !== _name[0]) {
		setName([name])
	}

	const handleClick = useCallback(
		(url: string) => {
			if (!url.includes(window.location.origin)) {
				return window.open(url, '_blank')
			}
			const name = url.split('/').pop()?.replace(/.md/, '')
			if (name) {
				setName(prev => [...prev, name])
			}
		},
		[setName],
	)

	const goHome = useCallback(() => {
		setName([name])
	}, [setName, name])

	const goBack = useCallback(() => {
		setName(prev => prev.slice(0, -1))
	}, [setName])

	const md = useMemo(
		(): string => guidance(_name[_name.length - 1]),
		[_name, guidance],
	)

	useEffect(() => {
		if (markdownContainer?.current) {
			const links = markdownContainer.current.querySelectorAll('a')
			links.forEach(link => {
				link.addEventListener('click', e => {
					e.preventDefault()
					handleClick((e.target as HTMLAnchorElement).href)
				})
			})
		}
	}, [handleClick, _name, markdownContainer])

	return (
		<Container ref={markdownContainer}>
			{_name.length > 2 ? (
				<Icon
					onClick={goBack}
					iconProps={{ iconName: 'Back' }}
					aria-label="Emoji"
				/>
			) : null}
			{_name.length > 1 ? (
				<Icon
					onClick={goHome}
					iconProps={{ iconName: 'Home' }}
					aria-label="Emoji"
				/>
			) : null}
			<Markdown>{md}</Markdown>
		</Container>
	)
})

const Container = styled.div`
	h1 {
		margin-top: 0;
	}
`

const Icon = styled(IconButton)`
	font-size: 2.5rem;
`
