/* eslint-disable */

import { Alt }  from '../'
import { OK }   from '../'
import { FAIL } from '../'
import { join } from '../'
import { error_spread } from '../'

const a = OK('foo' as const)

a // $ExpectType Alt<"OK", "foo">

const r1 = a.extract()
const r2 = a.extract_on('OK')
try { const r3 = a.extract_on('FAIL') } catch (e) { console.log(e) }

console.log(r1, r2)

const ch1 = a.chain('OK', (v) => OK(17 as const))
const ch2 = a.chain('FAIL', (v) => OK(true))

const r4 = ch1.extract()
const r5 = ch1.extract_on('OK')
try { const r6 = ch2.extract_on('FAIL') } catch (e) { console.log(e) }

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
try { const r9 = b.extract_on('FAIL') } catch (e) { console.log(e) }

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