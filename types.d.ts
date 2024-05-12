
export type Keys = (string | number | symbol)

import type { join as Join } from './index.js'


export interface Alt <Key extends Keys, Value>
{
	debug ()
		: { key: Key, value: Value }

	repr ()
		: Repr<this>,

	is <K extends Keys> (key: K)
		: this is Alt<K, K extends Key ? Value : unknown>,

	ripout ()
		: (Key extends 'OK' ? Value : undefined),

	extract_of <K extends Keys>
		(key: K, raise_fn?: (actual: Key, expected: K) => unknown)
			: (K extends Key ? Value : unknown),

	extract (raise_fn?: (actual: Key, expected: 'OK') => unknown)
		: (Key extends 'OK' ? Value : unknown),

	thru <Out> (fn: (alt: this) => Out)
		: Out,

	chain <const K extends Keys, Out extends Alt<any, any>>
		(key: K, fn: (value: K extends Key ? Value : never) => Out)
			: (K extends Key ? Out : this),

	map_to <const From extends Keys, const To extends Keys, Out>
		(from: From, to: To, fn: (value: (From extends Key ? Value : never)) => Out)
			: (From extends Key ? Alt<To, Out> : this),

	map_of <const K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<K, Out> : this),

	map <Out>
		(fn: (value: (Key extends 'OK' ? Value : never)) => Out)
			: (Key extends 'OK' ? Alt<Key, Out> : this),

	tap_of <const K extends Keys>
		(key: K, fn: (value: (K extends Key ? Value : never)) => void)
			: this,

	tap (fn: (value: (Key extends 'OK' ? Value : never)) => void)
			: this,

	settle_of <const K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<'OK', Out> : this),

	settle <Out>
		(fn: (value: (Key extends 'FAIL' ? Value : never)) => Out)
			: (Key extends 'FAIL' ? Alt<'OK', Out> : this),

	unless_of <const K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? never : Value)) => Out)
			: Alt<K, K extends Key ? Value : Out>,

	unless <Out>
		(fn: (value: (Key extends 'OK' ? never : Value)) => Out)
			: Alt<'OK', Key extends 'OK' ? Value : Out>,

	join <Right extends Alt<any, any>> (right: Right)
		: ReturnType<typeof Join<this, Right>>,
}


//
declare const repr$symbol: unique symbol

export type Repr <A extends Alt<any, any>> =
{
	[ repr$symbol ]: A,

	type: 'Alt',
	key: string,
	value: unknown,
}


//
export type Result <T, E = unknown> =
(
	Alt<'OK', T>
|
	Alt<'FAIL', E>
)

export type ResultProgress <T, E = unknown> =
(
	Result<T, E>
|
	Alt<'PROGRESS', void>
)
