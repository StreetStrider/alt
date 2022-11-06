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

}

function settle ()
{

}

function unless_on ()
{

}

function unless ()
{

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


// attempt
// capture
// capture
// error_spread

// load / repr
