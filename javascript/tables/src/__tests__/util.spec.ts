import { formatNumberStr } from '../util.js'

describe('util', () => {
	describe('formatNumberStr', () => {
		test('defaults', () => {
			expect(formatNumberStr('110.10')).toBe('110.10')
			expect(formatNumberStr('0.10')).toBe('.10')
			expect(formatNumberStr('1020345')).toBe('1020345')
			expect(formatNumberStr('001020345')).toBe('1020345')
			expect(formatNumberStr('102034500.123')).toBe('102034500.123')
			expect(formatNumberStr('102034500.123')).toBe('102034500.123')
		})

		test('comma as decimal', () => {
			const opts = { decimal: ',' }
			expect(formatNumberStr('110,10', opts)).toBe('110.10')
			expect(formatNumberStr('1020345', opts)).toBe('1020345')
			expect(formatNumberStr('102034500,123', opts)).toBe('102034500.123')
		})

		test('remove all valid comma separators when specified', () => {
			const opts = { thousands: ',' }
			expect(formatNumberStr('1020345', opts)).toBe('1020345')
			expect(formatNumberStr('102,034,500,123', opts)).toBe('102034500123')
			expect(formatNumberStr('00102,034,500,123', opts)).toBe('102034500123')
			expect(formatNumberStr('1,020,345.43', opts)).toBe('1020345.43')
		})

		test('invalid decimals (more than 1)', () => {
			expect(formatNumberStr('110.10.10')).toBe('')
			expect(formatNumberStr('110,10,10', { decimal: ',' })).toBe('')
		})

		test('invalid thousands separators', () => {
			expect(formatNumberStr('9012,010,010', { thousands: ',' })).toBe('')
			expect(formatNumberStr('110,10', { thousands: ',' })).toBe('')
			expect(formatNumberStr('110,10,1928', { thousands: ',' })).toBe('')
			// valid number, but should fail if thousands wasn't specified
			expect(formatNumberStr('110,101,928')).toBe('')
		})
	})
})
