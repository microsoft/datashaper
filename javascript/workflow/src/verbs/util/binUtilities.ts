/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { default as percentile } from 'percentile'

export function calculateAutoBinCount(
	min: number,
	max: number,
	values: number[],
): number {
	const fdResult = calculateBinCountWithBinWidth(
		min,
		max,
		calculateBinWidthFd(values),
	)
	const sturgesResult = calculateBinCountWithNumberOfBins(
		min,
		max,
		calculateNumberOfBinsSturges(values),
	)
	return Math.max(fdResult, sturgesResult)
}

export function calculateBinWidthFd(values: number[]): number {
	const iqrResult = iqr(values)

	return 2 * (iqrResult / Math.pow(values.length, 1 / 3))
}

export function calculateNumberOfBinsDoane(values: number[]): number {
	const N = values.length
	let sum = 0

	values.forEach(val => {
		sum = sum + val
	})

	const sumThird = Math.pow(sum, 3)
	const sumSqrt = Math.pow(sum, 2)

	const squareB = sumThird / Math.pow(sumSqrt, 3 / 2)
	const oSquareB = Math.sqrt((6 * (N - 2)) / ((N + 1) * (N + 3)))

	const width = Math.log2(N) + 1 + Math.log2(1 + squareB / oSquareB)

	return width
}

export function calculateBinWidthScott(values: number[]): number {
	return (
		standardDeviation(values) *
		Math.cbrt((24 * Math.sqrt(Math.PI)) / values.length)
	)
}

export function calculateNumberOfBinsRice(values: number[]): number {
	return 2 * Math.pow(values.length, 1 / 3)
}

export function calculateNumberOfBinsSturges(values: number[]): number {
	const width = Math.log2(values.length) + 1
	return width
}

export function calculateNumberOfBinsSqrt(values: number[]): number {
	return Math.sqrt(values.length)
}

export function calculateBinCountWithNumberOfBins(
	min: number,
	max: number,
	nh: number,
): number {
	return (max - min) / nh
}

export function calculateBinCountWithBinWidth(
	min: number,
	max: number,
	h: number,
): number {
	return (max - min) / Math.round(Math.ceil((max - min) / h))
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
