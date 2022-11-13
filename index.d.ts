
import { Key_Base } from './types'
import { Repr } from './types'
import { Alt } from './types'

import { Result } from './types'


export function Alt <Key extends Key_Base, Map extends { [K in Key]: void }> (key: Key)
	: Alt<Map>

export function Alt <Key extends Key_Base, Value, Map extends { [K in Key]: Value }> (key: Key, value: Value)
	: Alt<Map>

export function load <R extends Repr<any>> (repr: R): R extends Repr<infer A> ? A : never


export function join
<
	Left  extends Alt<any>,
	Right extends Alt<any>,
>
(
	left:  Left,
	right: Right,
)
	:
		(Left extends Alt<infer ML>
		?
			(Right extends Alt<infer MR>
			?
				Alt<Omit<ML, 'OK'> & Omit<MR, 'OK'> & { OK: [ ML['OK'], MR['OK'] ] }>
			:
				never
			)
		:
			never
		)


export function OK <Map extends { OK: void }> (): Alt<Map>
export function OK <Value, Map extends { OK: Value }> (value: Value): Alt<Map>

export function FAIL <Map extends { FAIL: void }> (): Alt<Map>
export function FAIL <Value, Map extends { FAIL: Value }> (value: Value): Alt<Map>

export function LOADING <Map extends { LOADING: void }> (): Alt<Map>
export function LOADING <Value, Map extends { LOADING: Value }> (value: Value): Alt<Map>


export function attempt <T, E = unknown> (fn: () => T): Result<T, E>

export function capture <T, E = unknown> (fn: () => (Promise<T> | T)): Promise<Result<T, E>>

/*
export function error_spread <A extends Alt<any>> (alt: A)
	:
		(A extends Alt<infer M>
		?
			(
				M['FAIL'] extends { message: string }
				?
					Alt<Omit<M, 'FAIL'> & Record<`FAIL:${ M['FAIL']['message'] }`, Extract<M['FAIL'], { message: M['FAIL']['message'] }>>>
				:
				A
			)
		:
		never)
*/

export const error_spread: any
