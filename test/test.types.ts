/* eslint-disable @typescript-eslint/no-unused-vars */

import { Alt as ALT } from '../'
import { Alt } from '../types'
import { Repr } from '../types'

import { OK } from '../'
import { FAIL } from '../'
import { LOADING } from '../'

import { join } from '../'
import { attempt } from '../'
import { capture } from '../'
import { error_spread } from '../'
import { load } from '../'


function construct ()
{
	const a1 = ALT('OK', 'foo' as const)
	a1 // $ExpectType Alt<{ OK: "foo"; }>

	const a11 = ALT('OK', 'foo')
	a11 // $ExpectType Alt<{ OK: string; }>

	const a111 = ALT('OK')
	a111 // $ExpectType Alt<{ OK: void; }>

	const a2 = OK('foo' as const)
	a2 // Alt<{ OK: "foo"; }>

	const a22 = OK('foo')
	a22 // Alt<{ OK: string; }>

	const a222 = OK()
	a222 // $ExpectType Alt<{ OK: void; }>

	const a3 = FAIL('foo' as const)
	a3 // $ExpectType Alt<{ FAIL: "foo"; }>

	const a33 = FAIL('foo')
	a33 // $ExpectType Alt<{ FAIL: string; }>

	const a333 = FAIL()
	a333 // $ExpectType Alt<{ FAIL: void; }>

	const a4 = LOADING('foo' as const)
	a4 // $ExpectType Alt<{ LOADING: "foo"; }>

	const a44 = LOADING('foo')
	a44 // $ExpectType Alt<{ LOADING: string; }>

	const a444 = LOADING()
	a444 // $ExpectType Alt<{ LOADING: void; }>

	let a5: Alt<{ OK: string, FAIL: void }>
	a5 = OK('foo')
	a5 = ALT('OK', 'bar')
	a5 = FAIL()
	a5 = ALT('FAIL')
	a5 // $ExpectType Alt<{ OK: string; FAIL: void; }>
}

function is ()
{
	const a = ALT('FOO', 17)
	a.is('FOO') // $ExpectType true
	a.is('BAR') // $ExpectType false
	// a.is('BAR' as any) // ExpectType boolean

	a // $ExpectType Alt<{ FOO: number; }>
	if (a.is('FOO'))
	{
		a // $ExpectType Alt<{ FOO: number; }>
	}

	const ok = OK(17)
	ok.is('OK')   // $ExpectType true
	ok.is('FAIL') // $ExpectType false
	// ok.is('FAIL' as any) // ExpectType boolean

	ok // $ExpectType Alt<{ OK: number; }>
	if (ok.is('OK'))
	{
		ok // $ExpectType Alt<{ OK: number; }>
	}

	const either: Alt<{ OK: number, FAIL: void }> = OK(17)
	either.is('OK')   // $ExpectType boolean
	either.is('FAIL') // $ExpectType boolean
	either.is('BAZ')  // $ExpectType false
}

function debug ()
{
	OK(true).debug() // $ExpectType { key: "OK"; value: boolean; }
	ALT('FOO', true).debug() // $ExpectType { key: "FOO"; value: boolean; }

	const either: Alt<{ OK: number, FAIL: void }> = OK(17)
	either.debug() // $ExpectType { key: "OK"; value: number; } | { key: "FAIL"; value: void; }
}

function extract ()
{
	OK(true).extract() // $ExpectType boolean
	ALT('FOO', true).extract() // $ExpectType never

	OK(true).extract_on('BAR') // $ExpectError
	ALT('FOO', true).extract_on('BAR') // $ExpectError

	ALT('FOO', true).extract_on('FOO') // $ExpectType boolean

	const a: Alt<{ OK: number, FAIL: void }> = OK(17)
	a.extract() // $ExpectType never
	a.extract_on('OK') // $ExpectType never
	a.extract_on('FOO') // $ExpectError

	const b: Alt<{ OK: number, FAIL: void }> = FAIL()
	b.extract() // $ExpectType never
	b.extract_on('OK') // $ExpectType never
	b.extract_on('FOO') // $ExpectError

	const b_ok = b.settle(() => 0)
	b_ok.extract() // $ExpectType number
	b_ok.extract_on('OK') // $ExpectType number
	b_ok.extract_on('FAIL') // $ExpectError
	b_ok.extract_on('FOO') // $ExpectError
}

function ripout ()
{
	OK(true).ripout() // $ExpectType boolean
	FAIL().ripout() // $ExpectType never
	ALT('FOO', true).ripout() // $ExpectType never

	const a: Alt<{ OK: number, FAIL: void }> = OK(17)
	a.ripout() // $ExpectType number | undefined

	const b: Alt<{ OK: number, FAIL: void }> = FAIL()
	b.ripout() // $ExpectType number | undefined

	const b_ok = b.settle(() => 0)
	b_ok.extract() // $ExpectType number
}

function thru ()
{
	const a: Alt<{ OK: number, FAIL: void }> = OK(17)
	const b = a.thru(a => [ a.debug() ] as const)
	b // $ExpectType readonly [{ key: "OK"; value: number; } | { key: "FAIL"; value: void; }]

	OK(true).thru(a => 17 as const) // $ExpectType 17
	FAIL().thru(a => 17 as const) // $ExpectType 17

	a.thru(a =>
	{
		a // $ExpectType Alt<{ OK: number; FAIL: void; }>
	})
}

function chain ()
{
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', s + 'd')) // $ExpectType Alt<{ FOO: string; }>
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', 17)) // $ExpectType Alt<{ FOO: number; }>

	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', s + 'd')) // $ExpectType Alt<{ BAR: string; }>
	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', 17)) // $ExpectType Alt<{ BAR: number; }>

	ALT('FOO', 'abc').chain('FOO', s =>
	{
		s // $ExpectType string
		return ALT('BAR', 17)
	})

	ALT('FOO', 'abc').chain('BAZ', s => // $ExpectError
		ALT('BAR', null))

	ALT('FOO', 'abc').chain('FOO',
		s => null) // $ExpectError
	ALT('FOO', 'abc').chain('BAZ', // $ExpectError
		s => null)

	const a: Alt<{ FOO: string, BAR: boolean }> = ALT('FOO', 'abc')
	a.chain('FOO', s => ALT('FOO', s + 'd')) // $ExpectType Alt<{ FOO: string; BAR: boolean; }>
	a.chain('FOO', s => ALT('FOO', 17)) // $ExpectType Alt<{ FOO: number; BAR: boolean; }>

	a.chain('FOO', s => ALT('BAR', s + 'd')) // $ExpectType Alt<{ BAR: string | boolean; }>
	a.chain('FOO', s => ALT('BAR', 17)) // $ExpectType Alt<{ BAR: number | boolean; }>
}

function map_to ()
{
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => s + 'd') // $ExpectType Alt<{ FOO: string; }>
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => 17) // $ExpectType Alt<{ FOO: number; }>

	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => s + 'd') // $ExpectType Alt<{ BAR: string; }>
	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => 17) // $ExpectType Alt<{ BAR: number; }>

	ALT('FOO', 'abc').map_to('FOO', 'BAR', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').map_to('BAZ', 'BAR', // $ExpectError
		s => null)

	const a: Alt<{ FOO: string, BAR: boolean }> = ALT('FOO', 'abc')
	a.map_to('FOO', 'FOO', s => s + 'd') // $ExpectType Alt<{ FOO: string; BAR: boolean; }>
	a.map_to('FOO', 'FOO', s => 17) // $ExpectType Alt<{ FOO: number; BAR: boolean; }>

	a.map_to('FOO', 'BAR', s => s + 'd') // Alt<{ BAR: string | boolean; }>
	a.map_to('FOO', 'BAR', s => 17) // $ExpectType Alt<{ BAR: number | boolean; }>
}

function map_on ()
{
	ALT('FOO', 'abc').map('FOO', s => s + 'd') // $ExpectType Alt<{ FOO: string; }>
	ALT('FOO', 'abc').map('FOO', s => 17) // $ExpectType Alt<{ FOO: number; }>
	ALT('FOO', 'abc').map('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').map('BAZ', // $ExpectError
		s => null)

	const a: Alt<{ FOO: string, BAR: boolean }> = ALT('FOO', 'abc')
	a.map('FOO', s => s + 'd') // $ExpectType Alt<{ FOO: string; BAR: boolean; }>
	a.map('FOO', s => 17)      // $ExpectType Alt<{ FOO: number; BAR: boolean; }>

	a.map('BAZ', // $ExpectError
		s => null)
}

function map ()
{
	ALT('OK', 'abc').map(s => s + 'd') // $ExpectType Alt<{ OK: string; }>
	ALT('OK', 'abc').map(s => 17)      // $ExpectType Alt<{ OK: number; }>
	ALT('OK', 'abc').map(s =>
	{
		s // $ExpectType string
	})

	ALT('FU', 'abc').map(s => null) // $ExpectType never
	ALT('FU', 'abc').map(s =>
	{
		s // $ExpectType never
	})

	const a: Alt<{ OK: string, FAIL: boolean }> = ALT('OK', 'abc')
	a.map(s => s + 'd') // $ExpectType Alt<{ OK: string; FAIL: boolean; }>
	a.map(s => 17)      // $ExpectType Alt<{ OK: number; FAIL: boolean; }>
}

function tap_on ()
{
	ALT('FOO', 'abc').tap('FOO', s => console.log(s + 'd')) // $ExpectType Alt<{ FOO: string; }>
	ALT('FOO', 'abc').tap('FOO', s => 17) // $ExpectType Alt<{ FOO: string; }>

	ALT('FOO', 'abc').tap('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').tap('BAZ', // $ExpectError
		s => null)
}

function tap ()
{
	ALT('OK', 'abc').tap(s => console.log(s + 'd')) // $ExpectType Alt<{ OK: string; }>
	ALT('OK', 'abc').tap(s => 17) // $ExpectType Alt<{ OK: string; }>

	ALT('OK', 'abc').tap(s =>
	{
		s // $ExpectType string
	})

	ALT('FU', 'abc').tap(s => null) // $ExpectType never
	ALT('FU', 'abc').tap(s =>
	{
		s // $ExpectType never
	})
}

function settle_on ()
{
	ALT('FOO', 'abc').settle_on('FOO', s => s + 'd') // $ExpectType Alt<{ OK: string; }>
	ALT('FOO', 'abc').settle_on('FOO', s => 17) // $ExpectType Alt<{ OK: number; }>
	ALT('FOO', 'abc').settle_on('FOO') // $ExpectType Alt<{ OK: string; }>

	ALT('FOO', 'abc').settle_on('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').settle_on('BAZ', // $ExpectError
		s => 17)
	ALT('FOO', 'abc').settle_on('BAZ') // $ExpectError
}

function settle ()
{
	ALT('FAIL', 'abc').settle(s => s + 'd') // $ExpectType Alt<{ OK: string; }>
	ALT('FAIL', 'abc').settle(s => 17) // $ExpectType Alt<{ OK: number; }>
	ALT('FAIL', 'abc').settle() // $ExpectType Alt<{ OK: string; }>

	ALT('FAIL', 'abc').settle(s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').settle(s =>
	{
		s // $ExpectType never
	})
	ALT('FOO', 'abc').settle(s => null) // $ExpectType never
	ALT('FOO', 'abc').settle() // $ExpectType never
}

function unless_on ()
{
	const a: Alt<{ FOO: number, BAR: string }> = ALT('BAR', 'abc')
	a.unless_on('FOO', s => s + 'd') // $ExpectType Alt<{ FOO: string | number; }>
	a.unless_on('FOO', s => 17) // $ExpectType Alt<{ FOO: number; }>
	a.unless_on('FOO') // $ExpectType Alt<{ FOO: string | number; }>

	ALT('FOO', 'abc').unless_on('FOO', s =>
	{
		s // $ExpectType never
	})
	ALT('FOO', 'abc').unless_on('FOO', s => null) // $ExpectType Alt<{ FOO: string; }>
	ALT('FOO', 'abc').unless_on('FOO') // $ExpectType Alt<{ FOO: string; }>

	ALT('FOO', 'abc').unless_on('BAZ', s => null) // $ExpectType Alt<{ BAZ: null; }>
	ALT('FOO', 'abc').unless_on('BAZ') // $ExpectType Alt<{ BAZ: string; }>
}

function unless ()
{
	const a: Alt<{ OK: null, FAIL: string }> = ALT('FAIL', 'abc')
	a.unless(s => s + 'd') // $ExpectType Alt<{ OK: string | null; }>
	a.unless(s => 17) // $ExpectType Alt<{ OK: number | null; }>
	a.unless() // $ExpectType Alt<{ OK: string | null; }>

	ALT('OK', 'abc').unless(s =>
	{
		s // $ExpectType never
	})
	ALT('OK', 'abc').unless(s => null) // $ExpectType Alt<{ OK: string; }>
	ALT('OK', 'abc').unless() // $ExpectType Alt<{ OK: string; }>

	ALT('FU', 'abc').unless(s => null) // $ExpectType Alt<{ OK: null; }>
	ALT('FU', 'abc').unless() // $ExpectType Alt<{ OK: string; }>
}


//
function join_generic ()
{
	const a: Alt<{ OK: 'LK', FAIL: 'LE' }> = OK('LK')
	const b: Alt<{ OK: 'RK', FAIL: 'RE' }> = FAIL('REE')

	join(a, b) // $ExpectType Alt<{ FAIL: "LE" | "RE"; OK: ["LK", "RK"]; }>
}

function join_generic_custom ()
{
	const a: Alt<{ F1: 'a1', F2: 'a2', OK: 'ak' }> = ALT('F1', 'a1')
	const b: Alt<{ F1: 'b1', F3: 'b3' }> = ALT('F3', 'b3')

	join(a, b) // $ExpectType Alt<{ F1: "a1" | "b1"; F2: "a2"; F3: "b3"; }>
}

function join_L ()
{
	const a = FAIL('LE' as const)
	const b = FAIL('RE' as const)

	join(a, b) // $ExpectType Alt<{ FAIL: "LE"; }>
}

function join_R ()
{
	const a = OK(true)
	const b = FAIL('RE' as const)

	join(a, b) // $ExpectType Alt<{ FAIL: "RE"; }>
}

function join_generic_ok ()
{
	const a = OK(true)
	const b = OK('abc')

	join(a, b) // $ExpectType Alt<{ OK: [boolean, string]; }>
}

function join_ok ()
{
	const a = OK('LK' as const)
	const b = OK('RK' as const)

	join(a, b) // $ExpectType Alt<{ OK: ["LK", "RK"]; }>
}


//
function attempt1 ()
{
	attempt(() => 17) // $ExpectType Result<number, unknown>
	// eslint-disable-next-line no-throw-literal
	attempt(() => { throw { x: 0 } }) // $ExpectType Result<never, unknown>
}

async function capture1 ()
{
	/* eslint-disable require-await */
	/* eslint-disable no-throw-literal */
	await capture(() => 17) // $ExpectType Result<number, unknown>
	await capture(async () => 17) // $ExpectType Result<number, unknown>
	await capture(() => { throw { x: 0 } }) // $ExpectType Result<never, unknown>
	await capture(async () => { throw { x: 0 } }) // $ExpectType Result<never, unknown>
	/* eslint-enable no-throw-literal */
	/* eslint-enable require-await */
}

function load_repr ()
{
	const a: Alt<{ OK: { s: string }, FAIL: void }> = OK({ s: 'abc' })

	a // $ExpectType Alt<{ OK: { s: string; }; FAIL: void; }>

	const r = a.repr()
	r // $ExpectType Repr<Alt<{ OK: { s: string; }; FAIL: void; }>>

	const b = load(r)
	b // $ExpectType Alt<{ OK: { s: string; }; FAIL: void; }>
}


//
function error_spread1 ()
{
	const ok = ALT('OK', { x: 1 })
	error_spread(ok) // $ExpectType Alt<{ OK: { x: number; }; }>

	const foo = new Error('FOO')
	error_spread(ALT('FAIL', foo)) // $ExpectType Alt<{ [x: `FAIL:${string}`]: Error; }>

	const bar = ALT('OK', new Error('BAR'))
	error_spread(bar) // $ExpectType Alt<{ OK: Error; }>

	const baz = ALT('FAIL', { error: true })
	error_spread(baz) // $ExpectType Alt<{ FAIL: { error: boolean; }; }>
}
