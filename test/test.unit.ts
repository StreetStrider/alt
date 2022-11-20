
import { expect } from 'chai'

// import Alt from '../'
import { Alt } from '../'
import { Repr } from '../types'

import { OK } from '../'
import { FAIL } from '../'
import { LOADING } from '../'

import { load } from '../'
import { join } from '../'
import { attempt } from '../'
import { capture } from '../'
import { error_spread } from '../'


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

		it('Alt(LOADING, v)', () =>
		{
			const a = Alt('LOADING', { x: 1 })

			expect(a.debug()).deep.eq({ key: 'LOADING', value: { x: 1 }})
		})

		it('Alt(LOADING)', () =>
		{
			const a = Alt('LOADING')

			expect(a.debug()).deep.eq({ key: 'LOADING', value: void 0 })
		})

		it('LOADING(v)', () =>
		{
			const a = LOADING({ x: 1 })

			expect(a.debug()).deep.eq({ key: 'LOADING', value: { x: 1 }})
		})

		it('LOADING()', () =>
		{
			const a = LOADING()

			expect(a.debug()).deep.eq({ key: 'LOADING', value: void 0 })
		})
	})

	describe('is', () =>
	{
		it('Alt', () =>
		{
			expect(Alt('OK').is('OK')).eq(true)
			expect(Alt('OK', 1).is('OK')).eq(true)
			expect(Alt('FAIL').is('OK')).eq(false)
			expect(Alt('FAIL', 1).is('OK')).eq(false)
		})

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
			expect(LOADING().is('OK')).eq(false)
			expect(LOADING().is('FAIL')).eq(false)
			expect(LOADING().is('LOADING')).eq(true)
			expect(LOADING().is('NONE')).eq(false)
		})

		it('NONE', () =>
		{
			expect(Alt('NONE', { x: 1 }).is('OK')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('FAIL')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('LOADING')).eq(false)
			expect(Alt('NONE', { x: 1 }).is('NONE')).eq(true)
		})
	})

	describe('debug', () =>
	{
		it('debug', () =>
		{
			expect(Alt('FOO', 17).debug()).deep.eq({ key: 'FOO', value: 17 })
			expect(OK(17).debug()).deep.eq({ key: 'OK', value: 17 })
		})
	})

	describe('extract', () =>
	{
		it('extract_on', () =>
		{
			expect(Alt('FOO', 17).extract_on('FOO')).eq(17)
			expect(() => Alt('FOO', 17).extract_on('BAR')).throw(TypeError) // $ExpectError
		})

		it('extract', () =>
		{
			expect(Alt('OK', 17).extract()).eq(17)
			expect(() => Alt('FOO', 17).extract()).throw(TypeError)
		})
	})

	describe('ripout', () =>
	{
		it('ripout', () =>
		{
			expect(Alt('OK', 17).ripout()).eq(17)
			expect(Alt('FOO', 17).ripout()).eq(void 0)
		})
	})

	describe('thru', () =>
	{
		it('thru', () =>
		{
			expect(Alt('OK', 17).thru(a => a.debug())).deep.eq({ key: 'OK', value: 17 })
		})
	})

	describe('chain', () =>
	{
		it('chain', () =>
		{
			expect(Alt('FOO', 17)
			.chain('FOO', v => Alt('BAR', [ v ]))
			.debug()).deep.eq({ key: 'BAR', value: [ 17 ] })

			const f = Alt('BAR', 17)
			expect(f.chain('FOO', v => Alt('BAZ', [ v ]))).eq(f) // $ExpectError
			expect(f.debug()).deep.eq({ key: 'BAR', value: 17 })
		})
	})

	describe('map', () =>
	{
		it('map_to', () =>
		{
			expect(Alt('FOO', 17).map_to('FOO', 'BAR', x => x + 1).debug()).deep.eq({ key: 'BAR', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.map_to('BAR', 'BAZ', x => x + 1)).eq(f) // $ExpectError
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })

			expect(Alt('FOO', 17).map_to('FOO', 'BAR').debug()).deep.eq({ key: 'BAR', value: 17 })
			expect(f.map_to('BAR', 'BAZ')).eq(f) // $ExpectError
		})

		it('map on key', () =>
		{
			expect(Alt('FOO', 17).map('FOO', x => x + 1).debug()).deep.eq({ key: 'FOO', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.map('BAR', x => x + 1)).eq(f) // $ExpectError
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })
		})

		it('map', () =>
		{
			expect(Alt('OK', 17).map(x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.map(x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })
		})
	})

	describe('tap', () =>
	{
		it('tap on key', () =>
		{
			let x1 = 0
			let x2 = 0

			const f1 = Alt('FOO', 17)
			expect(f1.tap('FOO', x => { x1++; return x + 1 })).eq(f1)
			expect(f1.debug()).deep.eq({ key: 'FOO', value: 17 })

			const f2 = Alt('FOO', 17)
			expect(f2.tap('BAR', x => { x2++; return x + 1 })).eq(f2) // $ExpectError
			expect(f2.debug()).deep.eq({ key: 'FOO', value: 17 })

			expect(x1).eq(1)
			expect(x2).eq(0)
		})

		it('tap', () =>
		{
			let x1 = 0
			let x2 = 0

			const f1 = Alt('OK', 17)
			expect(f1.tap(x => { x1++; return x + 1 })).eq(f1)
			expect(f1.debug()).deep.eq({ key: 'OK', value: 17 })

			const f2 = Alt('FOO', 17)
			expect(f2.tap(x => { x2++; return x + 1 })).eq(f2)
			expect(f2.debug()).deep.eq({ key: 'FOO', value: 17 })

			expect(x1).eq(1)
			expect(x2).eq(0)
		})
	})

	describe('settle', () =>
	{
		it('settle on key', () =>
		{
			expect(Alt('FOO', 17).settle('FOO', x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.settle('FOO', x => x + 1)).eq(f) // $ExpectError
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})

		it('settle on key()', () =>
		{
			expect(Alt('FOO', 17).settle('FOO').debug()).deep.eq({ key: 'OK', value: 17 })

			const f = Alt('OK', 17)
			expect(f.settle('FOO')).eq(f) // $ExpectError
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})

		it('settle', () =>
		{
			expect(Alt('FAIL', 17).settle(x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.settle(x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})

		it('settle()', () =>
		{
			expect(Alt('FAIL', 17).settle().debug()).deep.eq({ key: 'OK', value: 17 })

			const f = Alt('OK', 17)
			expect(f.settle()).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})
	})

	describe('unless', () =>
	{
		it('unless_on', () =>
		{
			expect(Alt('BAR', 17).unless_on('FOO', x => x + 1).debug()).deep.eq({ key: 'FOO', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.unless_on('FOO', x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })
		})

		it('unless_on()', () =>
		{
			expect(Alt('BAR', 17).unless_on('FOO').debug()).deep.eq({ key: 'FOO', value: 17 })

			const f = Alt('FOO', 17)
			expect(f.unless_on('FOO')).eq(f)
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })
		})

		it('unless', () =>
		{
			expect(Alt('BAR', 17).unless(x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.unless(x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})

		it('unless()', () =>
		{
			expect(Alt('BAR', 17).unless().debug()).deep.eq({ key: 'OK', value: 17 })

			const f = Alt('OK', 17)
			expect(f.unless()).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})
	})

	describe('join', () =>
	{
		it('(_, _)', () =>
		{
			const L = Alt('FOO', { x: 1 })
			const R = Alt('BAR', { y: true })

			const j = join(L, R)

			expect(j).eq(L)
		})

		it('(OK, _)', () =>
		{
			const L = Alt('OK', { x: 1 })
			const R = Alt('FU', { y: true })

			const j = join(L, R)

			expect(j).eq(R)
		})

		it('(_, OK)', () =>
		{
			const L = Alt('FU', { x: 1 })
			const R = Alt('OK', { y: true })

			const j = join(L, R)

			expect(j).eq(L)
		})

		it('(OK, OK)', () =>
		{
			const L = Alt('OK', { x: 1 })
			const R = Alt('OK', { y: true })

			const j = join(L, R)

			expect(j.is('OK')).eq(true)
			expect(j.extract()).deep.eq([ { x: 1 }, { y: true } ])
		})
	})

	describe('attempt', () =>
	{
		it('attempt', () =>
		{
			expect(attempt(() => 17).debug()).deep.eq({ key: 'OK', value: 17 })
			// eslint-disable-next-line no-throw-literal
			expect(attempt(() => { throw { x: 0 } }).debug()).deep.eq({ key: 'FAIL', value: { x: 0 }})
		})
	})

	describe('capture', () =>
	{
		/* eslint-disable require-await */
		/* eslint-disable no-throw-literal */
		it('capture', async () =>
		{
			expect((await capture(() => 17)).debug()).deep.eq({ key: 'OK', value: 17 })
			expect((await capture(async () => 17)).debug()).deep.eq({ key: 'OK', value: 17 })
			expect((await capture(() => { throw { x: 0 } })).debug()).deep.eq({ key: 'FAIL', value: { x: 0 }})
			expect((await capture(async () => { throw { x: 0 } })).debug()).deep.eq({ key: 'FAIL', value: { x: 0 }})
		})
		/* eslint-enable no-throw-literal */
		/* eslint-enable require-await */
	})

	describe('load / repr', () =>
	{
		it('load', () =>
		{
			const a = load({ type: 'Alt', key: 'OK', value: { y: 2 }} as Repr<any>)

			expect(a.debug()).deep.eq({ key: 'OK', value: { y: 2 }})
		})

		it('load wrong', () =>
		{
			expect(() => load(void 0)).throw(TypeError, 'alt/load/wrong') // $ExpectError
			expect(() => load(null)).throw(TypeError, 'alt/load/wrong') // $ExpectError
			expect(() => load(16)).throw(TypeError, 'alt/load/wrong') // $ExpectError
			expect(() => load({})).throw(TypeError, 'alt/load/wrong') // $ExpectError
			expect(() => load({ key: 'OK' })).throw(TypeError, 'alt/load/wrong') // $ExpectError
			expect(() => load({ key: 'OK', value: 1 })).throw(TypeError, 'alt/load/wrong') // $ExpectError

			expect(() => load({ type: 'Alt' })).throw(TypeError, 'alt/load/nokey') // $ExpectError
		})

		it('repr', () =>
		{
			expect(Alt('FOO', 17).repr()).deep.eq({ type: 'Alt', key: 'FOO', value: 17 })
			expect(OK(17).repr()).deep.eq({ type: 'Alt', key: 'OK', value: 17 })

			const f1 = Alt('FOO', 17)
			const re = f1.repr()
			const f2 = load(re)

			expect(f1.debug()).deep.eq(f2.debug())
			expect(f1.repr()).deep.eq(f2.repr())
		})
	})

	describe('error_spread', () =>
	{
		it('error_spread', () =>
		{
			const ok = Alt('OK', { x: 1 })
			expect(error_spread(ok)).eq(ok)

			const foo = new Error('FOO')
			expect(error_spread(Alt('FAIL', foo)).debug()).deep.eq({ key: 'FAIL:FOO', value: foo })

			const bar = Alt('OK', new Error('BAR'))
			expect(error_spread(bar)).eq(bar)
		})

		it('error_spread no message', () =>
		{
			const foo = { error: true }
			expect(error_spread(Alt('FAIL', foo)).debug()).deep.eq({ key: 'FAIL', value: foo })
		})
	})
})
