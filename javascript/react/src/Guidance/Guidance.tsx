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
import { GuidanceProps } from './types.js'

export const Guidance: React.FC<GuidanceProps> = memo(function Guidance({
	name = '',
	index,
}) {
	const markdownContainer = useRef<HTMLDivElement>(null)
	const guidance = useGuidance(index)
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
		(): string => guidance(_name[_name.length - 1] || ''),
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
			<ButtonWrapper>
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
			</ButtonWrapper>
			<Markdown>{md}</Markdown>
		</Container>
	)
})

const Container = styled.div`
	position: relative;

	h1 {
		margin-top: 0;
		color: ${({ theme }) => theme.application().midContrast().hex()};
	}

	h2 {
		color: ${({ theme }) => theme.application().midContrast().hex()};
	}

	table {
		border-collapse: collapse;

		th {
			font-weight: bold;
		}

		td,
		th {
			border: 1px solid
				${({ theme }) => theme.application().lowContrast().hex()};
			padding: 5px;
			text-align: center;
		}
	}
`

const Icon = styled(IconButton)`
	font-size: 2.5rem;
`

const ButtonWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`
