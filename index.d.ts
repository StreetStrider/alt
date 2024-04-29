
import type { Alt }    from './types.js'
import type { Keys }   from './types.js'
import type { Repr }   from './types.js'
import type { Result } from './types.js'
import type { ResultLoading } from './types.js'


export function Alt <const Key extends Keys> (key: Key)
	: Alt<Key, void>

export function Alt <const Key extends Keys, Value> (key: Key, value: Value)
	: Alt<Key, Value>


export function load <R extends Repr<any>> (repr: R)
	: (R extends Repr<infer A> ? A : never)


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
		(Left extends Alt<'OK', infer L>
		?
			(Right extends Alt<'OK', infer R>
			?
				Alt<'OK', [ L, R ]>
			:
				Right
			)
		:
			Left
		)


export function OK (): Alt<'OK', void>
export function OK <Value> (value: Value): Alt<'OK', Value>

export function FAIL (): Alt<'FAIL', void>
export function FAIL <Value> (value: Value): Alt<'FAIL', Value>

export function LOADING (): Alt<'LOADING', void>
export function LOADING <Value> (value: Value): Alt<'LOADING', Value>


export function attempt <T, E = unknown> (fn: () => T): Result<T, E>

export function capture <T, E = unknown> (fn: () => (Promise<T> | T)): Promise<Result<T, E>>

export function progress <T, E = unknown>
(
	fn: () => (Promise<T> | T),
	fn_setter: (r: ResultLoading<T, E>) => void,
)
	: void

export function error_spread <T extends Alt<any, any>> (alt: T)
:
	(T extends Alt<'FAIL', infer E>
	?
		(E extends { message: string }
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
		T
	)
