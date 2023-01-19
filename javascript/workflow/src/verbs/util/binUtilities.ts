/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { default as percentile } from 'percentile'
import { BinStrategy } from '@datashaper/schema'
import { default as linspace } from 'exact-linspace'

const ROUND_PRECISION = 3

export function calculateWidthAuto(
	min: number,
	max: number,
	values: number[],
): number {
	const fdResult = calculateWidthFd(values)
	const sturgesResult = calculateWidthSturges(min, max, values)
	return Math.min(fdResult, sturgesResult)
}

export function calculateWidthFd(values: number[]): number {
	const iqrResult = iqr(values)
	return 2 * iqrResult * Math.pow(values.length, -1 / 3)
}

export function calculateWidthScott(values: number[]): number {
	return (
		Math.pow(
			(24.0 * Math.pow(Math.sqrt(Math.PI), 0.5)) / values.length,
			1 / 3,
		) * standardDeviation(values)
	)
}

export function calculateWidthRice(
	min: number,
	max: number,
	values: number[],
): number {
	return (max - min) / (2.0 * Math.pow(values.length, 1 / 3))
}

export function calculateWidthSturges(
	min: number,
	max: number,
	values: number[],
): number {
	return (max - min) / (Math.log2(values.length) + 1)
}

export function calculateWidthSqrt(
	min: number,
	max: number,
	values: number[],
): number {
	return (max - min) / Math.sqrt(values.length)
}

export function calculateWidthDoane(
	min: number,
	max: number,
	values: number[],
): number {
	if (values.length > 2) {
		const sg1 = Math.sqrt(
			(6.0 * (values.length - 2)) /
				((values.length + 1.0) * (values.length + 3)),
		)
		const sigma = standardDeviation(values)
		if (sigma > 0.0) {
			const temp: number[] = []
			const mean: number = values.reduce((a, b) => a + b, 0) / values.length

			values.forEach((element: number) => {
				temp.push(element - mean)
			})

			for (let i = 0; i < temp.length; i++) {
				temp[i] = temp[i]! / sigma
			}

			for (let i = 0; i < temp.length; i++) {
				temp[i] = Math.pow(temp[i]!, 3)
			}

			const g1 = temp.reduce((a, b) => a + b, 0) / temp.length

			return (
				(max - min) /
				(1.0 + Math.log2(values.length) + Math.log2(1.0 + Math.abs(g1) / sg1))
			)
		}
	}

	return 0.0
}

export function calculateBinCount(
	min: number,
	max: number,
	width: number,
): number {
	return Math.round(Math.ceil((max - min) / width))
}

export function standardDeviation(values: number[], precision = 3): number {
	const N = values.length
	let sum = 0
	let squareNumbersSum = 0

	values.forEach(val => {
		sum = sum + val
		squareNumbersSum = squareNumbersSum + val * val
	})

	const variance = (squareNumbersSum - (sum * sum) / N) / (N - 1)
	const standarDeviationResult = Math.sqrt(variance)

	return Number(standarDeviationResult.toFixed(precision))
}

function ascending(a: number, b: number): number {
	return a - b
}

export function iqr(values: number[]): number {
	values.sort(ascending)
	const q1: number = percentile(25, values) as number
	const q3: number = percentile(75, values) as number
	return q3 - q1
}

export function estimateBinValues(
	min: number,
	max: number,
	strategy: BinStrategy,
	values: number[],
	nice?: boolean
): [number, number, number]{
	let width = estimateWidth(strategy, values, min, max)

	if(nice){
		const adjustedValues = calculateNiceRounding(min, max, width)
		const [minValue, maxValue, widthValue] = adjustedValues
		min = minValue
		max = maxValue
		width = widthValue
	}
	
	const numBins = calculateBinCount(min, max, width)
	const binEdges = linspace(min, max, numBins + 1)
	return [min, max, roundNumber(binEdges[1]! - binEdges[0]!)]
}

function estimateWidth(
	strategy: BinStrategy,
	values: number[],
	min: number,
	max: number,
): number {
	switch (strategy) {
		case BinStrategy.Auto:
			return calculateWidthAuto(min, max, values)
		case BinStrategy.Fd:
			return calculateWidthFd(values)
		case BinStrategy.Doane:
			return calculateWidthDoane(min, max, values)
		case BinStrategy.Scott:
			return calculateWidthScott(values)
		case BinStrategy.Rice:
			return calculateWidthRice(min, max, values)
		case BinStrategy.Sturges:
			return calculateWidthSturges(min, max, values)
		case BinStrategy.Sqrt:
			return calculateWidthSqrt(min, max, values)
		default:
			throw new Error(`Unsupported bin strategy ${strategy}`)
	}
}

export function calculateNiceRounding(
	min: number,
	max: number,
	step: number,
): [number, number, number] {
	return [roundNumber(min), roundNumber(max), roundNumber(step)]
}

export function roundNumber(value: number): number{
	if(value < 1 && getNumberOfDecimals(value) > 10){
		return Number(value.toFixed(ROUND_PRECISION))
	}
	else if(value < 1 && getNumberOfDecimals(value) <= 10){
		const numberOfDecimals = getNumberOfDecimals(value)
		return Number(value.toFixed(numberOfDecimals / ROUND_PRECISION))
	}
	else {
		return Number(value.toPrecision(1))
	}
}

function getNumberOfDecimals(value: number): number{
	const decimals = value.toString().split(".")
	return decimals[1] !== undefined ? decimals[1].length : 0
}