import { from, of } from 'rxjs'

import { DelegateSubject } from '../DelegateSubject.js'

describe('The DelegateSubject', () => {
	it('can receive inputs', () => {
		const s = new DelegateSubject(12)
		expect(s.value).toBe(12)

		s.input = of(1)
		expect(s.value).toBe(1)

		s.input = of(2)
		expect(s.value).toBe(2)

		s.input = from([3, 4, 5])
		expect(s.value).toBe(5)

		expect((s as any)._subscription).toBeDefined()

		s.input = undefined
		expect(s.value).toBeUndefined()

		expect((s as any)._subscription).toBeUndefined()
	})
})
