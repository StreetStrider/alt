
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

		/*
		it('Alt(OK)', () =>
		{
			const a = Alt('OK')

			expect(a.debug()).deep.eq({ key: 'OK', value: void 0 })
		})*/

		it('OK(v)', () =>
		{
			const a = OK({ x: 1 })

			expect(a.debug()).deep.eq({ key: 'OK', value: { x: 1 }})
		})

		/*
		it('OK()', () =>
		{
			const a = OK()

			expect(a.debug()).deep.eq({ key: 'OK', value: void 0 })
		})*/

		it('Alt(FAIL, v)', () =>
		{
			const a = Alt('FAIL', { x: 1 })

			expect(a.debug()).deep.eq({ key: 'FAIL', value: { x: 1 }})
		})

		/*
		it('Alt(FAIL)', () =>
		{
			const a = Alt('FAIL')

			expect(a.debug()).deep.eq({ key: 'FAIL', value: void 0 })
		})*/

		it('FAIL(v)', () =>
		{
			const a = FAIL({ x: 1 })

			expect(a.debug()).deep.eq({ key: 'FAIL', value: { x: 1 }})
		})

		/*
		it('FAIL()', () =>
		{
			const a = FAIL()

			expect(a.debug()).deep.eq({ key: 'FAIL', value: void 0 })
		})*/

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

	describe('repr', () =>
	{
		it('repr', () =>
		{
			expect(Alt('FOO', 17).repr()).deep.eq({ type: 'Alt', key: 'FOO', value: 17 })
			expect(OK(17).repr()).deep.eq({ type: 'Alt', key: 'OK', value: 17 })
		})
	})

	describe('extract', () =>
	{
		it('extract_on', () =>
		{
			expect(Alt('FOO', 17).extract_on('FOO')).eq(17)
			expect(() => Alt('FOO', 17).extract_on('BAR')).throw(TypeError)
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
			expect(f.chain('FOO', v => Alt('BAZ', [ v ]))).eq(f)
			expect(f.debug()).deep.eq({ key: 'BAR', value: 17 })
		})
	})

	describe('map', () =>
	{
		it('map_to', () =>
		{
			expect(Alt('FOO', 17).map_to('FOO', 'BAR', x => x + 1).debug()).deep.eq({ key: 'BAR', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.map_to('BAR', 'BAZ', x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'FOO', value: 17 })
		})

		it('map_on', () =>
		{
			expect(Alt('FOO', 17).map_on('FOO', x => x + 1).debug()).deep.eq({ key: 'FOO', value: 18 })

			const f = Alt('FOO', 17)
			expect(f.map_on('BAR', x => x + 1)).eq(f)
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
		it('tap_on', () =>
		{
			let x1 = 0
			let x2 = 0

			const f1 = Alt('FOO', 17)
			expect(f1.tap_on('FOO', x => { x1++; return x + 1 })).eq(f1)
			expect(f1.debug()).deep.eq({ key: 'FOO', value: 17 })

			const f2 = Alt('FOO', 17)
			expect(f2.tap_on('BAR', x => { x2++; return x + 1 })).eq(f2)
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
		it('settle_on', () =>
		{
			expect(Alt('FOO', 17).settle_on('FOO', x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.settle_on('FOO', x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})

		it('settle', () =>
		{
			expect(Alt('FAIL', 17).settle(x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.settle(x => x + 1)).eq(f)
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

		it('unless', () =>
		{
			expect(Alt('BAR', 17).unless(x => x + 1).debug()).deep.eq({ key: 'OK', value: 18 })

			const f = Alt('OK', 17)
			expect(f.unless(x => x + 1)).eq(f)
			expect(f.debug()).deep.eq({ key: 'OK', value: 17 })
		})
	})

	xdescribe('join', () =>
	{
		it('join', () =>
		{

		})
	})

	xdescribe('Result', () =>
	{
		it('Result', () =>
		{

		})

		it('ResultLoading', () =>
		{

		})
	})

	xdescribe('attempt', () =>
	{
		it('attempt', () =>
		{

		})
	})

	xdescribe('error_spread', () =>
	{
		it('error_spread', () =>
		{

		})
	})

	xdescribe('load / repr', () =>
	{
		it('load', () =>
		{

		})
	})
})
