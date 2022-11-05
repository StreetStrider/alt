
import { expect } from 'chai'

import Alt from '../'
import { OK } from '../'
import { FAIL } from '../'
import { LOADING } from '../'
import { load } from '../'


describe('Alt', () =>
{
	describe('Alt()', () =>
	{
		it('Alt(OK, v)', () =>
		{
			const a = Alt('OK', { x: 1 })

			expect(a.debug()).deep.eq({ key: 'OK', value: { x: 1 }})
		})

		it('Alt(OK)', () =>
		{
			const a = Alt('OK')

			expect(a.debug()).deep.eq({ key: 'OK', value: void 0 })
		})

		it('OK(v)', () =>
		{
			const a = OK({ x: 1 })

			expect(a.debug()).deep.eq({ key: 'OK', value: { x: 1 }})
		})

		it('OK()', () =>
		{
			const a = OK()

			expect(a.debug()).deep.eq({ key: 'OK', value: void 0 })
		})

		it('Alt(FAIL, v)', () =>
		{
			const a = Alt('FAIL', { x: 1 })

			expect(a.debug()).deep.eq({ key: 'FAIL', value: { x: 1 }})
		})

		it('Alt(FAIL)', () =>
		{
			const a = Alt('FAIL')

			expect(a.debug()).deep.eq({ key: 'FAIL', value: void 0 })
		})

		it('FAIL(v)', () =>
		{
			const a = FAIL({ x: 1 })

			expect(a.debug()).deep.eq({ key: 'FAIL', value: { x: 1 }})
		})

		it('FAIL()', () =>
		{
			const a = FAIL()

			expect(a.debug()).deep.eq({ key: 'FAIL', value: void 0 })
		})

		it('Alt(LOADING)', () =>
		{
			const a = Alt('LOADING', { x: 1 })

			expect(a.debug()).deep.eq({ key: 'LOADING', value: { x: 1 }})
		})

		it('LOADING()', () =>
		{
			const a = LOADING()

			expect(a.debug()).deep.eq({ key: 'LOADING', value: void 0 })
		})

		it('load', () =>
		{
			const a = load({ type: 'Alt', key: 'OK', value: { y: 2 }})

			expect(a.debug()).deep.eq({ key: 'OK', value: { y: 2 }})
		})
	})

	describe('is', () =>
	{
		it('OK', () =>
		{
			expect(OK({ x: 1 }).is('OK')).eq(true)
			expect(OK({ x: 1 }).is('FAIL')).eq(false)
			expect(OK({ x: 1 }).is('LOADING')).eq(false)
			expect(OK({ x: 1 }).is('NONE')).eq(false)
		})

		it('FAIL', () =>
		{
			expect(FAIL({ x: 1 }).is('OK')).eq(false)
			expect(FAIL({ x: 1 }).is('FAIL')).eq(true)
			expect(FAIL({ x: 1 }).is('LOADING')).eq(false)
			expect(FAIL({ x: 1 }).is('NONE')).eq(false)
		})

		it('LOADING', () =>
		{
			expect(LOADING({ x: 1 }).is('OK')).eq(false)
			expect(LOADING({ x: 1 }).is('FAIL')).eq(false)
			expect(LOADING({ x: 1 }).is('LOADING')).eq(true)
			expect(LOADING({ x: 1 }).is('NONE')).eq(false)
		})

		it('NONE', () =>
		{
			expect(Alt('NONE', { x: 1 }).is('OK')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('FAIL')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('LOADING')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('NONE')).eq(true)
		})
	})
})
