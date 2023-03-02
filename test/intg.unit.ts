
import { expect } from 'chai'

import { OK } from '../'
import { Alt } from '../types'


type V = { text: string }
function V (text: string): V
{
	return { text }
}


describe('Integration', () =>
{
	it('waterfall #1', () =>
	{
		const a = OK({ data: 'foo' }) as Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void>

		const b = a
		.map(ok => V(ok.data))
		.map('FAIL', e => V(e.message))
		.map('LOADING', () => V('~'))
		.unless()
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #2', () =>
	{
		const a = OK({ data: 'foo' }) as Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void>

		const b = a
		.map('FAIL', e => V(e.message))
		.map('LOADING', () => V('~'))
		.map(ok => V(ok.data))
		.unless()
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #3', () =>
	{
		const a = OK({ data: 'foo' }) as Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void>

		const b = a
		.map(ok => ok.data)
		.map('FAIL', e => e.message)
		.map('LOADING', () => '~')
		.map(V)
		.unless(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #4', () =>
	{
		const a: Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void> = OK({ data: 'foo' })

		const b = a
		.map('FAIL', e => e.message)
		.map('LOADING', () => '~')
		.map(ok => ok.data)
		.unless()
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #5 settle', () =>
	{
		const a: Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void> = OK({ data: 'foo' })

		const b = a
		.map(ok => V(ok.data))
		.settle(e => V(e.message))
		.settle('LOADING', () => V('~'))
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #6 settle', () =>
	{
		const a: Alt<'OK', string> | Alt<'FAIL', Error> | Alt<'LOADING', void> = OK('foo')

		const b = a
		.settle(e => e.message)
		.settle('LOADING', () => '~')
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #7 map_to', () =>
	{
		const a: Alt<'OK', { data: string }> | Alt<'FAIL', Error> | Alt<'LOADING', void> = OK({ data: 'foo' })

		const b = a
		.map(ok => V(ok.data))
		.map_to('FAIL', 'OK', e => V(e.message))
		.map_to('LOADING', 'OK', () => V('~'))
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #8 map_to', () =>
	{
		const a: Alt<'OK', string> | Alt<'FAIL', Error> | Alt<'LOADING', void> = OK('foo')

		const b = a
		.map_to('FAIL', 'OK', e => e.message)
		.map_to('LOADING', 'OK', () => '~')
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})
})
