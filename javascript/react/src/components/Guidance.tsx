/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import Markdown from 'markdown-to-jsx'
import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import styled from 'styled-components'

import {
	useGoBack,
	useGoHome,
	useGuidance,
	useHandleClick,
} from './Guidance.hooks.js'

export interface GuidanceProps {
	name: string
	index: Record<string, string>
}

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

	const handleClick = useHandleClick(setName)
	const goHome = useGoHome(name, setName)
	const goBack = useGoBack(setName)

	const preProcess = useCallback((text: string): string => {
		const r = /(?<=##.*?\n)([\s\S]*)/g
		const content = text.replace(r, `<div className="details">$1</div>`)
		return content
	}, [])

	const md = useMemo((): string => {
		const text = guidance(_name[_name.length - 1] || '')
		return preProcess(text)
	}, [_name, guidance, preProcess])

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

	const handleHeaderClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const target: HTMLHeadingElement =
				(event.target as Element).nodeName === 'H2'
					? event.target
					: ((event.target as Element).closest('h2') as any)
			if (target.classList.contains('active')) {
				target.classList.remove('active')
			} else {
				target.classList.add('active')
			}
		},
		[],
	)

	const H2Component = useCallback(
		({ children, ...props }: any): JSX.Element => {
			return (
				<h2 {...props}>
					{children}
					<IconButton
						onClick={handleHeaderClick}
						aria-label="Emoji"
						iconProps={{ iconName: 'AddTo' }}
					/>
				</h2>
			)
		},
		[handleHeaderClick],
	)

	const options = {
		overrides: {
			h2: {
				component: H2Component,
			},
		},
	}

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
			<Markdown options={options}>{md}</Markdown>
		</Container>
	)
})

const Container = styled.div`
	position: relative;

	h1 {
		margin-top: 0;
		text-transform: uppercase;
		color: ${({ theme }) => theme.application().lowMidContrast().hex()};
	}

	h2 {
		color: ${({ theme }) => theme.application().midContrast().hex()};

		display: flex;
		align-items: center;
		gap: 1rem;

		&.active + .details {
			opacity: 1;
			height: auto;
			transform: translateX(0);
			overflow-x: auto;
		}
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

	.details {
		opacity: 0;
		height: 0;
		transition: transform 0.5s ease-in-out;
		transform: translateX(100%);
		overflow-x: hidden;
	}
`

const Icon = styled(IconButton as any)`
	font-size: 2.5rem;
`

const ButtonWrapper = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`
