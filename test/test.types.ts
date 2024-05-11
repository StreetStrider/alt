
import { Alt as ALT } from '../'
import { Alt } from '../types'
import { Repr } from '../types'
import { Result } from '../types'
import { ResultLoading } from '../types'

import { OK } from '../'
import { FAIL } from '../'
import { LOADING } from '../'

import { join } from '../'
import { attempt } from '../'
import { capture } from '../'
import { error_spread } from '../'
import { load } from '../'


type TestResult = (Alt<'OK', number> | Alt<'FAIL', void>)
type TestResultFooBar = (Alt<'FOO', string> | Alt<'BAR', boolean>)

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

	let a5: Alt<'OK', string> | Alt<'FAIL', void>
	a5 = OK('foo')
	a5 // $ExpectType Alt<"OK", string>
	a5 = ALT('OK', 'bar')
	a5 = FAIL()
	a5 = ALT('FAIL')
	a5 // $ExpectType Alt<"FAIL", void>
}

function is ()
{
	const a = ALT('FOO', 17)
	a.is('FOO') // $ExpectType boolean
	a.is('BAR') // $ExpectType boolean
	a.is('BAR' as string) // $ExpectType boolean
	a.is('BAR' as any) // $ExpectType boolean

	a // $ExpectType Alt<"FOO", number>
	if (a.is('FOO'))
	{
		a // $ExpectType Alt<"FOO", number>
	}

	const ok = OK(17)
	ok.is('OK')   // $ExpectType boolean
	ok.is('FAIL') // $ExpectType boolean
	ok.is('FAIL' as string) // $ExpectType boolean
	ok.is('FAIL' as any) // $ExpectType boolean

	ok // $ExpectType Alt<"OK", number>
	if (ok.is('OK'))
	{
		ok // $ExpectType Alt<"OK", number>
	}

	{
		let either: TestResult = OK(17)
		either.is('OK')   // $ExpectType boolean
		either.is('FAIL') // $ExpectType boolean
		either.is('BAZ')  // $ExpectType boolean

		either // $ExpectType Alt<"OK", number>
		if (either.is('OK'))
		{
			either // $ExpectType Alt<"OK", number>
		}
	}

	{
		let either = OK(17) as TestResult
		either.is('OK')   // $ExpectType boolean
		either.is('FAIL') // $ExpectType boolean
		either.is('BAZ')  // $ExpectType boolean

		either // $ExpectType TestResult

		if (either.is('FAIL'))
		{
			either // $ExpectType Alt<"FAIL", void>
		}
		else
		{
			either // $ExpectType Alt<"OK", number>
		}

		if (either.is('OK'))
		{
			either // $ExpectType Alt<"OK", number>
		}
		else
		{
			either // $ExpectType Alt<"FAIL", void>
		}
	}
}

function debug ()
{
	OK(true).debug() // $ExpectType { key: "OK"; value: boolean; }
	ALT('FOO', true).debug() // $ExpectType { key: "FOO"; value: boolean; }

	const either = OK(17) as TestResult
	either.debug() // $ExpectType { key: "FAIL"; value: void; } | { key: "OK"; value: number; }
}

function extract ()
{
	const a1: boolean = OK(true).extract() // $ExpectType boolean
	const a2: boolean = ALT('FOO', true).extract() // $ExpectError

	OK(true).extract_of('BAR') // $ExpectType unknown
	ALT('FOO', true).extract_of('BAR') // $ExpectType unknown

	ALT('FOO', true).extract_of('FOO') // $ExpectType boolean

	const a = OK(17) as TestResult
	a.extract() // $ExpectType unknown
	a.extract_of('FAIL') // $ExpectType unknown
	a.extract_of('FOO') // $ExpectType unknown

	const b = FAIL() as TestResult
	b.extract() // $ExpectType unknown
	b.extract_of('OK') // $ExpectType unknown
	b.extract_of('FOO') // $ExpectError unknown

	const b_ok = b.settle_of('FAIL', () => 0)
	b_ok.extract() // $ExpectType number
	b_ok.extract_of('OK') // $ExpectType number
	b_ok.extract_of('FAIL') // $ExpectType unknown
	b_ok.extract_of('FOO') // $ExpectType unknown
}

function ripout ()
{
	const a1: boolean = OK(true).ripout() // $ExpectType boolean
	const a2: boolean = FAIL().ripout() // $ExpectError
	const a3: boolean = ALT('FOO', true).ripout() // $ExpectError

	const b = OK(17) as TestResult
	b.ripout() // $ExpectType number | undefined

	const c = FAIL() as TestResult
	c.ripout() // $ExpectType number | undefined

	const c_ok = c.settle_of('FAIL', () => 0)
	c_ok.ripout() // $ExpectType number
}

function thru ()
{
	OK(true).thru(a => 17 as const) // $ExpectType 17
	FAIL().thru(  a => 17 as const) // $ExpectType 17

	const a = OK(17) as TestResult
	const b = a.thru(a => [ a.debug() ] as const)
	b // $ExpectType readonly [{ key: "FAIL"; value: void; } | { key: "OK"; value: number; }]

	a.thru(a =>
	{
		a // $ExpectType Alt<"FAIL", void> | Alt<"OK", number>
	})
}

function chain ()
{
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', s + 'd')) // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').chain('FOO', s => ALT('FOO', 17)) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', s + 'd')) // $ExpectType Alt<"BAR", string>
	ALT('FOO', 'abc').chain('FOO', s => ALT('BAR', 17)) // $ExpectType Alt<"BAR", number>

	ALT('FOO', 'abc').chain('FOO', s =>
	{
		s // $ExpectType string
		return ALT('BAR', 17)
	})

	ALT('FOO', 'abc').chain('BAZ', s => // ExpectType never
		ALT('BAR', null))

	ALT('FOO', 'abc').chain('FOO',
		s => null) // $ExpectError
	// ALT('FOO', 'abc').chain('BAZ', // $-ExpectError
	// 	s => null)

	const a = ALT('FOO', 'abc') as TestResultFooBar
	a.chain('FOO', s => ALT('FOO', s + 'd')) // $ExpectType Alt<"FOO", string> | Alt<"BAR", boolean>
	a.chain('FOO', s => ALT('FOO', 17)) // $ExpectType Alt<"BAR", boolean> | Alt<"FOO", number>

	a.chain('FOO', s => ALT('BAR', s + 'd')) // $ExpectType Alt<"BAR", boolean> | Alt<"BAR", string>
	a.chain('FOO', s => ALT('BAR', 17)) // $ExpectType Alt<"BAR", boolean> | Alt<"BAR", number>
}

function map_to ()
{
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').map_to('FOO', 'FOO', s => 17) // $ExpectType Alt<"FOO", number>

	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => s + 'd') // $ExpectType Alt<"BAR", string>
	ALT('FOO', 'abc').map_to('FOO', 'BAR', s => 17) // $ExpectType Alt<"BAR", number>

	ALT('FOO', 'abc').map_to('FOO', 'BAR', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').map_to('BAZ', 'BAR', s =>
	{
		s // $ExpectType never
	})

	const a = ALT('FOO', 'abc') as TestResultFooBar
	a.map_to('FOO', 'FOO', s => s + 'd') // $ExpectType Alt<"FOO", string> | Alt<"BAR", boolean>

	a.map_to('FOO', 'FOO', s => 17) // $ExpectType Alt<"BAR", boolean> | Alt<"FOO", number>

	a.map_to('FOO', 'BAR', s => s + 'd') // $ExpectType Alt<"BAR", boolean> | Alt<"BAR", string>
	a.map_to('FOO', 'BAR', s => 17) // $ExpectType Alt<"BAR", boolean> | Alt<"BAR", number>
}

function map_of ()
{
	ALT('FOO', 'abc').map_of('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').map_of('FOO', s => 17) // $ExpectType Alt<"FOO", number>
	ALT('FOO', 'abc').map_of('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').map_of('BAZ', s =>
	{
		s // $ExpectType never
	})

	const a = ALT('FOO', 'abc') as TestResultFooBar
	a.map_of('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string> | Alt<"BAR", boolean>
	a.map_of('FOO', s => 17)      // $ExpectType Alt<"BAR", boolean> | Alt<"FOO", number>

	a.map_of('BAZ', s =>
	{
		s // $ExpectType never
	})
}

function map ()
{
	ALT('OK', 'abc').map(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('OK', 'abc').map(s => 17)      // $ExpectType Alt<"OK", number>
	ALT('OK', 'abc').map(s =>
	{
		s // $ExpectType string
	})

	const a = ALT('OK', 'abc') as Alt<'OK', string> | Alt<'FAIL', boolean>
	a.map(s => s + 'd') // $ExpectType Alt<"OK", string> | Alt<"FAIL", boolean>
	a.map(s => 17)      // $ExpectType Alt<"OK", number> | Alt<"FAIL", boolean>
}

function tap_of ()
{
	ALT('FOO', 'abc').tap_of('FOO', s => console.log(s + 'd')) // $ExpectType Alt<"FOO", string>
	ALT('FOO', 'abc').tap_of('FOO', s => 17) // $ExpectType Alt<"FOO", string>

	ALT('FOO', 'abc').tap_of('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').tap_of('BAZ', s =>
	{
		s // $ExpectType never
	})

	const a = ALT('FOO', 'abc') as TestResultFooBar
	a.tap_of('FOO', s =>
	{
		s // $ExpectType string
	})
	.tap_of('BAR', b =>
	{
		b // $ExpectType boolean
	})
	.tap_of('BAZ', s =>
	{
		s // $ExpectType never
	})
}

function tap ()
{
	ALT('OK', 'abc').tap(s => console.log(s + 'd')) // $ExpectType Alt<"OK", string>
	ALT('OK', 'abc').tap(s => 17) // $ExpectType Alt<"OK", string>

	ALT('OK', 'abc').tap(s =>
	{
		s // $ExpectType string
	})

	ALT('FU', 'abc').tap(s => null) // $ExpectType Alt<"FU", string>
	ALT('FU', 'abc').tap(s =>
	{
		s // $ExpectType never
	})

	const a = ALT('OK', 17) as TestResult
	a.tap(s =>
	{
		s // $ExpectType number
	})
	.tap_of('FAIL', v =>
	{
		v // $ExpectType void
	})
	.tap_of('BAZ', s =>
	{
		s // $ExpectType never
	})
}

function settle_of ()
{
	ALT('FOO', 'abc').settle_of('FOO', s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('FOO', 'abc').settle_of('FOO', s => 17) // $ExpectType Alt<"OK", number>
	// ALT('FOO', 'abc').settle_of('FOO') // $-ExpectType Alt<"OK", string>

	ALT('FOO', 'abc').settle_of('FOO', s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').settle_of('BAZ', s =>
	{
		s // $ExpectType never
	})

	const a = ALT('FOO', 'abc') as TestResultFooBar
	a.settle_of('FOO', s => s + 'd') // $ExpectType Alt<"OK", string> | Alt<"BAR", boolean>
	a.settle_of('FOO', s => 17)      // $ExpectType Alt<"OK", number> | Alt<"BAR", boolean>

	a.settle_of('FOO', s =>
	{
		s // $ExpectType string
	})

	a.settle_of('BAZ', s =>
	{
		s // $ExpectType never
	})
}

function settle ()
{
	ALT('FAIL', 'abc').settle(s => s + 'd') // $ExpectType Alt<"OK", string>
	ALT('FAIL', 'abc').settle(s => 17) // $ExpectType Alt<"OK", number>
	// ALT('FAIL', 'abc').settle() // $-ExpectType Alt<"OK", string>

	ALT('FAIL', 'abc').settle(s =>
	{
		s // $ExpectType string
	})

	ALT('FOO', 'abc').settle(s =>
	{
		s // $ExpectType never
	})

	const a = ALT('FAIL') as TestResult
	a.settle(s => s + 'd') // $ExpectType Alt<"OK", string> | Alt<"OK", number>
	a.settle(s => 17)      // $ExpectType Alt<"OK", number>

	a.settle(s =>
	{
		s // $ExpectType void
	})

	a.settle_of('FOO', s =>
	{
		s // $ExpectType never
	})
}

function unless_on ()
{
	ALT('FOO', 'abc').unless('FOO', s =>
	{
		s // $ExpectType never
	})
	ALT('FOO', 'abc').unless('FOO', s => null) // $ExpectType Alt<"FOO", string>
	// ALT('FOO', 'abc').unless('FOO') // $ExpectType Alt<"FOO", string>

	ALT('FOO', 'abc').unless('BAZ', s => null) // $ExpectType Alt<"BAZ", null>
	// ALT('FOO', 'abc').unless('BAZ') // $ExpectType Alt<"BAZ", string>

	const a = ALT('BAR', 'abc') as Alt<'FOO', number> | Alt<'BAR', string>
	a.unless('FOO', s => s + 'd') // $ExpectType Alt<"FOO", string> | Alt<"FOO", number>
	a.unless('FOO', s => 17) // $ExpectType Alt<"FOO", number>
	// a.unless('FOO') // $-ExpectType Alt<"FOO", number> | Alt<"FOO", unknown>
}

/*
function unless ()
{
	const a: Alt<{ OK: null, FAIL: string }> = ALT('FAIL', 'abc')
	a.unless(s => s + 'd') // $-ExpectType Alt<{ OK: string | null; }>
	a.unless(s => 17) // $-ExpectType Alt<{ OK: number | null; }>
	a.unless() // $-ExpectType Alt<{ OK: string | null; }>

	ALT('OK', 'abc').unless(s =>
	{
		s // $-ExpectType never
	})
	ALT('OK', 'abc').unless(s => null) // $-ExpectType Alt<"OK", string>
	ALT('OK', 'abc').unless() // $-ExpectType Alt<"OK", string>

	ALT('FU', 'abc').unless(s => null) // $-ExpectType Alt<{ OK: null; }>
	ALT('FU', 'abc').unless() // $-ExpectType Alt<"OK", string>
}
*/


//
function join_generic ()
{
	const a = OK('LK')   as Alt<'OK', 'LK'> | Alt<'FAIL', 'LE'>
	const b = FAIL('RE') as Alt<'OK', 'RK'> | Alt<'FAIL', 'RE'>

	join(a, b) // $ExpectType Alt<"FAIL", "LE"> | Alt<"FAIL", "RE"> | Alt<"OK", ["LK", "RK"]>
}

function join_generic_custom ()
{
	const a = ALT('F1', 'a1') as Alt<'F1', 'a1'> | Alt<'F2', 'a2'> | Alt<'OK', 'ak'>
	const b = ALT('F3', 'b3') as Alt<'F1', 'b1'> | Alt<'F3', 'b3'>

	join(a, b) // $ExpectType Alt<"F1", "a1"> | Alt<"F2", "a2"> | Alt<"F1", "b1"> | Alt<"F3", "b3">
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
	const a = OK({ s: 'abc' }) as Alt<'OK', { s: string }> | Alt<'FAIL', void>

	a // $ExpectType Alt<"FAIL", void> | Alt<"OK", { s: string; }>

	const r = a.repr()
	r // $ExpectType Repr<Alt<"FAIL", void>> | Repr<Alt<"OK", { s: string; }>>

	const b = load(r)
	b // $ExpectType Alt<"FAIL", void> | Alt<"OK", { s: string; }>
}


//
function error_spread1 ()
{
	const ok = ALT('OK', { x: 1 })
	error_spread(ok) // $ExpectType Alt<"OK", { x: number; }>

	const foo = new Error('FOO')
	error_spread(ALT('FAIL', foo)) // $ExpectType Alt<`FAIL:${string}`, Error>

	const bar = ALT('OK', new Error('BAR'))
	error_spread(bar) // $ExpectType Alt<"OK", Error>

	const baz = ALT('FAIL', { error: true })
	error_spread(baz) // $ExpectType Alt<"FAIL", { error: boolean; }>
}


function variance ()
{
	type T1 = Alt<'X', number> | Alt<'Y', string>
	type T2 = Alt<'X', number>

	const t1: T1 = ALT('X', 1) as T1
	const t2: T2 = ALT('X', 1) as T2

	t1 // $ExpectType T1
	t2 // $ExpectType T2

	const t2_1: T2 = t1 // $ExpectError
	const t1_2: T1 = t2

	const r1: Result<number> = OK(17) as Result<number>
	const r2: ResultLoading<number> = OK(17) as ResultLoading<number>

	r1 // $ExpectType Result<number>
	r2 // $ExpectType ResultLoading<number>

	const r2_1: ResultLoading<number> = r1
	const r1_2: Result<number> = r2 // $ExpectError
}
