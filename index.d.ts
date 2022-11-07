
import { Key_Base } from './types'
import { Repr } from './types'
import { Alt } from './types'

import { Result } from './types'


export function Alt <Key extends Key_Base, Value> (key: Key, value: Value): Alt<Key, Value>

export function load <R extends Repr<any>> (repr: R)
	: R extends Repr<infer A> ? A : never


export function OK <Value> (value: Value): Alt<'OK', Value>

export function FAIL <Value> (value: Value): Alt<'FAIL', Value>

export function LOADING (): Alt<'LOADING', void>


export function join
<
	Left  extends Alt<any, any>,
	Right extends Alt<any, any>,
>
(
	left:  Left,
	right: Right,
)
	:
		(Left extends Alt<'OK', infer L_V>
		?
			(Right extends Alt<'OK', infer R_V>
			? Alt<'OK', [ L_V, R_V ]>
			: Right
			)
		:
		Left
		)


export function attempt <T, E = unknown> (fn: () => T): Result<T, E>


export function capture <T, E = unknown> (fn: () => (Promise<T> | T)): Promise<Result<T, E>>


export function error_spread <T extends Alt<any, any>> (alt: T)
	:
		(T extends Alt<'FAIL', infer E>
		?
			(
				E extends { message: string }
				?
					(E['message'] extends any
					?
						Alt<`FAIL:${ E['message'] }`, Extract<E, { message: E['message'] }>>
					:
						never
					)
				:
				T
			)
		:
		T)
