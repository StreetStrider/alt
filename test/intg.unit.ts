
import { expect } from 'chai'

import { OK } from '../'
import { Alt } from '../types'


type V = { text: string }
function V (text: string): V
{
	return { text }
}

type TestResult <T> = (Alt<'OK', T> | Alt<'FAIL', Error> | Alt<'PROGRESS', void>)


describe('Integration', () =>
{
	it('waterfall #1', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		.map_of('FAIL', e => V(e.message))
		.map_of('PROGRESS', () => V('~'))
		.unless(_ => _)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #2', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map_of('FAIL', e => V(e.message))
		.map_of('PROGRESS', () => V('~'))
		.map(ok => V(ok.data))
		.unless(_ => _)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #3', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => ok.data)
		.map_of('FAIL', e => e.message)
		.map_of('PROGRESS', () => '~')
		.map(V)
		.unless(V)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #4', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map_of('FAIL', e => e.message)
		.map_of('PROGRESS', () => '~')
		.map(ok => ok.data)
		.unless(_ => _)
		.map(V)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #5 settle', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		.settle(e => V(e.message))
		.settle_of('PROGRESS', () => V('~'))
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #6 settle', () =>
	{
		const a = OK('foo') as TestResult<string>

		const b = a
		.settle(e => e.message)
		.settle_of('PROGRESS', () => '~')
		.map(V)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #7 map_to', () =>
	{
		const a = OK({ data: 'foo' }) as TestResult<{ data: string }>

		const b = a
		.map(ok => V(ok.data))
		.map_to('FAIL', 'OK', e => V(e.message))
		.map_to('PROGRESS', 'OK', () => V('~'))
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})

	it('waterfall #8 map_to', () =>
	{
		const a = OK('foo') as TestResult<string>

		const b = a
		.map_to('FAIL', 'OK', e => e.message)
		.map_to('PROGRESS', 'OK', () => '~')
		.map(V)
		b // $ExpectType Alt<"OK", V>

		const c = b.extract()
		c // $ExpectType V

		expect(c).deep.eq({ text: 'foo' })
	})
})
