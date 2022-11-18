
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
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map(ok => V(ok.data))
		.map_on('FAIL', e => V(e.message))
		.map_on('LOADING', () => V('~'))
		.unless(_ => _)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #2', () =>
	{
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map_on('FAIL', e => V(e.message))
		.map_on('LOADING', () => V('~'))
		.map(ok => V(ok.data))
		.unless(_ => _)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #3', () =>
	{
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map(ok => ok.data)
		.map_on('FAIL', e => e.message)
		.map_on('LOADING', () => '~')
		.map(V)
		.unless(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #4', () =>
	{
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map_on('FAIL', e => e.message)
		.map_on('LOADING', () => '~')
		.map(ok => ok.data)
		.unless(_ => _)
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #5 settle', () =>
	{
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map(ok => V(ok.data))
		.settle(e => V(e.message))
		.settle_on('LOADING', () => V('~'))
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #6 settle', () =>
	{
		const a: Alt<{ OK: string, FAIL: Error, LOADING: void }> = OK('foo')

		const b = a
		.settle(e => e.message)
		.settle_on('LOADING', () => '~')
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #7 map_to', () =>
	{
		const a: Alt<{ OK: { data: string }, FAIL: Error, LOADING: void }> = OK({ data: 'foo' })

		const b = a
		.map(ok => V(ok.data))
		.map_to('FAIL', 'OK', e => V(e.message))
		.map_to('LOADING', 'OK', () => V('~'))
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})

	it('waterfall #8 map_to', () =>
	{
		const a: Alt<{ OK: string, FAIL: Error, LOADING: void }> = OK('foo')

		const b = a
		.map_to('FAIL', 'OK', e => e.message)
		.map_to('LOADING', 'OK', () => '~')
		.map(V)
		b // $ExpectType Alt<{ OK: V; }>

		const c = b.extract()
		c // $ExpectType V
	})
})
