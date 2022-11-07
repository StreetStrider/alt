/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

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
	a1 // $ExpectType Alt<"OK", "foo">

	const a11 = ALT('OK', 'foo')
	a11 // $ExpectType Alt<"OK", string>

	const a111 = ALT('OK')
	a111 // $ExpectType Alt<"OK", void>

	const a2 = OK('foo' as const)
	a2 // $ExpectType Alt<"OK", "foo">

	const a22 = OK('foo')
	a22 // $ExpectType Alt<"OK", string>

	const a222 = OK()
	a222 // $ExpectType Alt<"OK", void>

	const a3 = FAIL('foo' as const)
	a3 // $ExpectType Alt<"FAIL", "foo">

	const a33 = FAIL('foo')
	a33 // $ExpectType Alt<"FAIL", string>

	const a333 = FAIL()
	a333 // $ExpectType Alt<"FAIL", void>

	const a4 = LOADING('foo' as const)
	a4 // $ExpectType Alt<"LOADING", "foo">

	const a44 = LOADING('foo')
	a44 // $ExpectType Alt<"LOADING", string>

	const a444 = LOADING()
	a444 // $ExpectType Alt<"LOADING", void>
}

function is ()
{
	const a = ALT('FOO', 17)
	a.is('FOO') // $ExpectType true
	a.is('BAR') // $ExpectType false

	const ok = OK(17)
	ok.is('OK')   // $ExpectType true
	ok.is('FAIL') // $ExpectType false
}

function debug ()
{
	OK(true).debug() // $ExpectType { key: "OK"; value: boolean; }
	ALT('FOO', true).debug() // $ExpectType { key: "FOO"; value: boolean; }
}

type Either <T = void, E = void> = (Alt<'OK', T> | Alt<'FAIL', E>)

function extract ()
{
	OK(true).extract() // $ExpectType boolean
	ALT('FOO', true).extract() // $ExpectType never

	OK(true).extract_on('BAR') // $ExpectType never
	ALT('FOO', true).extract_on('BAR') // $ExpectType never
	ALT('FOO', true).extract_on('FOO') // $ExpectType boolean

	const a = OK(true) as Either<boolean>
	a.extract() // $ExpectType boolean
	a.extract_on('OK') // $ExpectType boolean
	a.extract_on('FOO') // $ExpectType never

	const b = FAIL(void 0) as Either<boolean>
	b.extract() // $ExpectType boolean
	b.extract_on('OK') // $ExpectType boolean
	b.extract_on('FOO') // $ExpectType never
}

function ripout ()
{
	OK(true).ripout() // $ExpectType boolean
	ALT('FOO', true).ripout() // $ExpectType undefined

	const a = OK(true) as Either<boolean>
	a.ripout() // $ExpectType boolean | undefined

	const b = FAIL(void 0) as Either<boolean>
	b.ripout() // $ExpectType boolean | undefined
}

function thru ()
{
	const a = OK(true) as Either<boolean>
	const b = a.thru(a => [ a.debug() ] as const)
	b // $ExpectType readonly [{ key: "OK"; value: boolean; } | { key: "FAIL"; value: void; }]

	OK(true).thru(a => 17 as const) // $ExpectType 17
	FAIL(void 0).thru(a => 17 as const) // $ExpectType 17
}

function chain ()
{
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', s + 'd')) // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', 17)) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', s + 'd')) // $ExpectType Alt<"BAR", string>
	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', 17)) // $ExpectType Alt<"BAR", number>

	ALT('FOO', 'abc').chain('BAZ', s => ALT('BAR', null)) // $ExpectType Alt<"FOO", string>

	ALT('FOO', 'abc').chain('FOO', s => null) // $ExpectError
	ALT('FOO', 'abc').chain('BAZ', s => null) // $ExpectError
}

function map_to ()
{
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => 17) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => s + 'd') // $ExpectType Alt<"BAR", string>
	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => 17) // $ExpectType Alt<"BAR", number>

	ALT('FOO', 'abc').map_to('BAZ', 'BAR', s => null) // $ExpectType Alt<"FOO", string>
}

function map_on ()
{
	ALT('FOO', 'abc').map_on('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').map_on('FOO', s => 17) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').map_on('BAZ', s => null) // $ExpectType Alt<"FOO", string>
}

function map ()
{
	ALT('OK', 'abc').map(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('OK', 'abc').map(s => 17) // $ExpectType Alt<"OK", number>

	ALT('FU', 'abc').map(s => null) // $ExpectType Alt<"FU", string>
}

function tap_on ()
{
	ALT('FOO', 'abc').tap_on('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').tap_on('FOO', s => 17) // $ExpectType Alt<"FOO", string>

	ALT('FOO', 'abc').tap_on('BAZ', s => null) // $ExpectType Alt<"FOO", string>
}

function tap ()
{
	ALT('OK', 'abc').tap(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('OK', 'abc').tap(s => 17) // $ExpectType Alt<"OK", string>

	ALT('FU', 'abc').tap(s => null) // $ExpectType Alt<"FU", string>
}

function settle_on ()
{
	ALT('FOO', 'abc').settle_on('FOO', s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('FOO', 'abc').settle_on('FOO', s => 17) // $ExpectType Alt<"OK", number>

	ALT('FOO', 'abc').settle_on('BAZ', s => 17) // $ExpectType Alt<"FOO", string>
}

function settle ()
{
	ALT('FAIL', 'abc').settle(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('FAIL', 'abc').settle(s => 17) // $ExpectType Alt<"OK", number>

	ALT('FOO', 'abc').settle(s => 17) // $ExpectType Alt<"FOO", string>
}

function unless_on ()
{
	ALT('BAR', 'abc').unless_on('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('BAR', 'abc').unless_on('FOO', s => 17) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').unless_on('FOO', s => null) // $ExpectType Alt<"FOO", string>
}

function unless ()
{
	ALT('FOO', 'abc').unless(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('FOO', 'abc').unless(s => 17) // $ExpectType Alt<"OK", number>

	ALT('OK', 'abc').unless(s => null) // $ExpectType Alt<"OK", string>
}

function join_generic ()
{
	const a = OK('LK') as Either<'LK', 'LE'>
	const b = OK('RK') as Either<'RK', 'RE'>

	join(a, b) // $ExpectType Alt<"FAIL", "LE"> | Alt<"FAIL", "RE"> | Alt<"OK", ["LK", "RK"]>
}

function join_L ()
{
	const a = FAIL('LE' as const)
	const b = FAIL('RE' as const)

	join(a, b) // $ExpectType Alt<"FAIL", "LE">
}

function join_R ()
{
	const a = OK(true)
	const b = FAIL('RE' as const)

	join(a, b) // $ExpectType Alt<"FAIL", "RE">
}

function join_generic_ok ()
{
	const a = OK(true)
	const b = OK('abc')

	join(a, b) // $ExpectType Alt<"OK", [boolean, string]>
}

function join_ok ()
{
	const a = OK('LK' as const)
	const b = OK('RK' as const)

	join(a, b) // $ExpectType Alt<"OK", ["LK", "RK"]>
}

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

function error_spread1 ()
{
	const ok = ALT('OK', { x: 1 })
	error_spread(ok) // $ExpectType Alt<"OK", { x: number; }>

	const foo = new Error('FOO')
	error_spread(ALT('FAIL', foo)) // $ExpectType Alt<`FAIL:${string}`, Error>

	const bar = ALT('OK', new Error('BAR'))
	error_spread(bar) // $ExpectType Alt<"OK", Error>
}

function load_repr ()
{
	type T = { s: string }
	const a = OK({ s: 'abc' }) as Either<T>

	a // $ExpectType Either<T, void>

	const r = a.repr()
	r // $ExpectType Repr<Alt<"FAIL", void>> | Repr<Alt<"OK", T>>

	const b = load(r)
	b // $ExpectType Alt<"FAIL", void> | Alt<"OK", T>
}
