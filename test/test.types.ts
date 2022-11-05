/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import ALT from '../'
import { Alt } from '../'

import { OK } from '../'
import { FAIL } from '../'
// import { LOADING } from '../'

// import { load } from '../'
import { join } from '../'
// import { attempt } from '../'
// import { capture } from '../'
import { error_spread } from '../'


function construct ()
{
	const a1 = ALT('OK', 'foo' as const)
	a1 // $ExpectType Alt<"OK", "foo">

	const a2 = ALT('OK', 'foo')
	a2 // $ExpectType Alt<"OK", string>

	const a3 = OK('foo' as const)
	a3 // $ExpectType Alt<"OK", "foo">

	const a4 = OK('foo')
	a4 // $ExpectType Alt<"OK", string>
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

type Either <T = void> = (Alt<'OK', T> | Alt<'FAIL', void>)

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

// settle
// unless

// join
// attempt
// capture
// capture
// error_spread

// load / repr

/*
const r1 = a.extract()
const r2 = a.extract_on('OK')
try { const r3 = a.extract_on('FAIL') }
 catch (e) { console.log(e) }

console.log(r1, r2)

const ch1 = a.chain('OK', (v) => OK(17 as const))
const ch2 = a.chain('FAIL', (v) => OK(true))

const r4 = ch1.extract()
const r5 = ch1.extract_on('OK')
try { const r6 = ch2.extract_on('FAIL') }
 catch (e) { console.log(e) }

console.log(r4, r5)

function foo (v: number)
{
	if (v < 0)
	{
		return FAIL(v)
	}
	else
	{
		return OK(String(v))
	}
}

const b = foo(0)

const r7 = b.extract()
const r8 = b.extract_on('OK')
try { const r9 = b.extract_on('FAIL') }
 catch (e) { console.log(e) }

console.log(r7, r8)

const b1 = b.map_on('OK', () => 18 as const)
const b2 = b.map(() => 19 as const)
const b3 = b.map_to('FAIL', 'FAIL2', () => 'F2' as const)
const b4 = b.map_on('FAIL', () => 'F' as const)
const b5 = b.settle_on('FAIL', () => 'FOK' as const)
const b6 = b.settle(() => 'FOKK' as const)
const b7 = b.settle_on('BAR', () => 'FOKK' as const)

const j1 = join(a, b)
const j2 = join(a, FAIL(false))
const j3 = join(a, OK(false))
const j4 = join(FAIL(false), b)
const j5 = join(OK(false), b)
const j6 = join(OK('foo'), FAIL(1))

const ae1 = FAIL(new TypeError('foo')) // Alt('FAIL', new TypeError('foo'))
const ae1a: (Alt<'OK', 1> | typeof ae1) = ae1 as any
const ae1s = error_spread(ae1a)

const ae1s_v = ae1s.extract()

const E: (RangeError & { message: 'foo' }) = new RangeError('R1' as const) as any
// const E: ({ message: 'foo' }) = new RangeError('R1' as const) as any
const ae2 = FAIL(E) // Alt('FAIL', E)
const ae2a: (Alt<'OK', 2> | typeof ae2) = ae2 as any
const ae2s = error_spread(ae2a)

const ae2s_2 = ae2s.extract()

;(new RangeError).message
E.message
*/
