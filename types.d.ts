
export type Keys = (string | number | symbol)
export type Base = Record<Keys, unknown>


export interface Alt <Key extends Keys, Value>
{
	debug ()
		: { key: Key, value: Value }

	repr ()
		: Repr<this>,

	// TODO is: predicate?
	is <K extends Keys> (key: K)
		: (K extends Key ? true : false),

	ripout ()
		: ('OK' extends Key ? Value : undefined),

	// TODO try strict keys?
	// extract <K extends Keys> (key: K)
	// 	: (K extends Key ? Value : never),

	extract ()
		: ('OK' extends Key ? Value : unknown),

	thru <Out> (fn: (alt: this) => Out)
		: Out,

	chain <K extends Keys, Out extends Alt<any, any>>
		(key: K, fn: (value: K extends Key ? Value : never) => Out)
			: (K extends Key ? Out : this),

	map_to <From extends Keys, To extends Keys, Out>
		(from: From, to: To, fn: (value: (From extends Key ? Value : never)) => Out)
			: (From extends Key ? Alt<To, Out> : this),

	map <K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<K, Out> : this),

	tap <K extends Keys>
		(key: K, fn: (value: (K extends Key ? Value : never)) => void)
			: K extends Key ? this : unknown,

	// tap(fn)

	settle <K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<'OK', Out> : this),

	// settle <K extends Keys>
	// 	(key: K)
	// 		: (K extends Key ? Alt<'OK', Value> : this),

	// settle <Out> (fn: (value: ('FAIL' extends Key ? Value : never)) => Out)
	// 	: ('FAIL' extends Key ? Alt<'OK', Out> : this),

	// settle ()
	// 	: ('FAIL' extends Key ? Alt<'OK', Value> : this),

	unless <K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? never : Value)) => Out)
			: Alt<K, K extends Key ? Value : Out>,

	// unless <K extends Keys>
	// 	(key: K)
	// 		: Alt<K, Value>,

	// unless <Out> (fn: (value: ('OK' extends Key ? never : Value)) => Out)
	// 	: Alt<'OK', Key extends 'OK' ? Value : Out>,

	// unless ()
	//
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

export type ResultLoading <T, E = unknown> =
(
	Result<T, E>
|
	Alt<'LOADING', void>
)
