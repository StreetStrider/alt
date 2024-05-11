
import { expect } from 'chai'

import { OK } from '../'
import { Alt } from '../types'


type V = { text: string }
function V (text: string): V
{
	return { text }
}

type TestResult <T> = (Alt<'OK', T> | Alt<'FAIL', Error> | Alt<'LOADING', void>)


describe('Integration', () =>
{
	it('waterfall #1', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		.map_of('FAIL', e => V(e.message))
		.map_of('LOADING', () => V('~'))
		/* @ts-expect-error */
		.unless()
		b // $-ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #2', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map_of('FAIL', e => V(e.message))
		.map_of('LOADING', () => V('~'))
		.map(ok => V(ok.data))
		/* @ts-expect-error */
		.unless()
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #3', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => ok.data)
		.map_of('FAIL', e => e.message)
		.map_of('LOADING', () => '~')
		.map(V)
		/* @ts-expect-error */
		.unless(V)
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #4', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map_of('FAIL', e => e.message)
		.map_of('LOADING', () => '~')
		.map(ok => ok.data)
		/* @ts-expect-error */
		.unless()
		.map(V)
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #5 settle', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		/* @ts-expect-error */
		.settle(e => V(e.message))
		.settle('LOADING', () => V('~'))
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #6 settle', () =>
	{
		const a = OK('foo') as TestResult<string>

		const b = a
		/* @ts-expect-error */
		.settle(e => e.message)
		.settle('LOADING', () => '~')
		.map(V)
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #7 map_to', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		.map_to('FAIL', 'OK', e => V(e.message))
		.map_to('LOADING', 'OK', () => V('~'))
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #8 map_to', () =>
	{
		const a = OK('foo') as TestResult<string>

		const b = a
		.map_to('FAIL', 'OK', e => e.message)
		.map_to('LOADING', 'OK', () => '~')
		.map(V)
		b // $-ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $-ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})
})
