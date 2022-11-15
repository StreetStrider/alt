
import { Alt } from './types'
import { Key_Base } from './types'

import { Repr } from './types'
import { Join } from './types'
import { Result } from './types'
import { Spread } from './types'


export function Alt <Key extends Key_Base, Map extends { [K in Key]: void }> (key: Key)
	: Alt<Map>

export function Alt <Key extends Key_Base, Value, Map extends { [K in Key]: Value }>
	(key: Key, value: Value)
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
	: Join<Left, Right>


export function OK <Map extends { OK: void }> (): Alt<Map>
export function OK <Value, Map extends { OK: Value }> (value: Value): Alt<Map>

export function FAIL <Map extends { FAIL: void }> (): Alt<Map>
export function FAIL <Value, Map extends { FAIL: Value }> (value: Value): Alt<Map>

export function LOADING <Map extends { LOADING: void }> (): Alt<Map>
export function LOADING <Value, Map extends { LOADING: Value }> (value: Value): Alt<Map>


export function attempt <T, E = unknown> (fn: () => T): Result<T, E>

export function capture <T, E = unknown> (fn: () => (Promise<T> | T)): Promise<Result<T, E>>

export function error_spread <A extends Alt<any>> (alt: A): Spread<A>
