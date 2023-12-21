
export type Keys = (string | number | symbol)


export interface Alt <Key extends Keys, Value>
{
	debug ()
		: { key: Key, value: Value }

	repr ()
		: Repr<this>,

	/* too boring:
	is <const K extends Keys> (key: K) // (0)
		: boolean, */

	is <const K extends Keys> (key: K) // (1)
		: (K extends Key ? true : false),

	/* we're not there yet:
	is <const K extends Keys> (key: K) // (2)
		: this is (K extends Key ? Alt<K, Value> : unknown), */

	ripout ()
		: ('OK' extends Key ? Value : undefined),

	extract ()
		: ('OK' extends Key ? Value : unknown),

	// extract <K extends Keys> (key: K)
	// 	: (K extends Key ? Value : never),

	thru <Out> (fn: (alt: this) => Out)
		: Out,

	chain <const K extends Keys, Out extends Alt<any, any>>
		(key: K, fn: (value: K extends Key ? Value : never) => Out)
			: (K extends Key ? Out : this),

	map_to <const From extends Keys, const To extends Keys, Out>
		(from: From, to: To, fn: (value: (From extends Key ? Value : never)) => Out)
			: (From extends Key ? Alt<To, Out> : this),

	map <const K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<K, Out> : this),

	tap <const K extends Keys>
		(key: K, fn: (value: (K extends Key ? Value : never)) => void)
			: this,

	// tap(fn)

	settle <const K extends Keys, Out>
		(key: K, fn: (value: (K extends Key ? Value : never)) => Out)
			: (K extends Key ? Alt<'OK', Out> : this),

	// settle <K extends Keys>
	// 	(key: K)
	// 		: (K extends Key ? Alt<'OK', Value> : this),

	// settle <Out> (fn: (value: ('FAIL' extends Key ? Value : never)) => Out)
	// 	: ('FAIL' extends Key ? Alt<'OK', Out> : this),

	// settle ()
	// 	: ('FAIL' extends Key ? Alt<'OK', Value> : this),

	unless <const K extends Keys, Out>
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
