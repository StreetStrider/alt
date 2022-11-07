
export type Key_Base = (string | number | symbol)

declare const repr$symbol: unique symbol // = Symbol('repr')

export type Repr <T extends Alt<any, any>> =
{
	[ repr$symbol ]: T,

	type: 'Alt',
	key: string,
	value: unknown,
}

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

export type Alt <Key extends Key_Base, Value> =
{
	is <Key_Possible extends Key_Base> (key: Key_Possible)
		: (Key_Possible extends Key ? true : false),

	extract_on <Key_Possible extends Key_Base> (key: Key_Possible)
		: (Key_Possible extends Key ? Value : never),

	extract ()
		: ('OK' extends Key ? Value : never),

	ripout ()
		: ('OK' extends Key ? Value : undefined),

	thru <Out> (fn: (alt: Alt<Key, Value>) => Out)
		: Out,

	chain <Key_Possible extends Key_Base, Out extends Alt<any, any>>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Out : Alt<Key, Value>),

	map_to <Key_From extends Key_Base, Key_To extends Key_Base, Out>
		(from: Key_From, to: Key_To, fn: (value: (Key_From extends Key ? Value : never)) => Out)
			: (Key_From extends Key ? Alt<Key_To, Out> : Alt<Key, Value>),

	map_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Alt<Key_Possible, Out> : Alt<Key, Value>),

	map <Out> (fn: (value: ('OK' extends Key ? Value : never)) => Out)
		: ('OK' extends Key ? Alt<'OK', Out> : Alt<Key, Value>),

	tap_on <Key_Possible extends Key_Base>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => void)
			: Alt<Key, Value>,

	tap (fn: (value: ('OK' extends Key ? Value : never)) => void)
		: Alt<Key, Value>,

	settle_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Alt<'OK', Out> : Alt<Key, Value>),

	settle <Out> (fn: (value: ('FAIL' extends Key ? Value : never)) => Out)
		: ('FAIL' extends Key ? Alt<'OK', Out> : Alt<Key, Value>),

	unless_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? never : Value)) => Out)
			: Alt<Key_Possible, Key extends Key_Possible ? Value : Out>,

	unless <Out> (fn: (value: ('OK' extends Key ? never : Value)) => Out)
		: Alt<'OK', Key extends 'OK' ? Value : Out>,

	debug ()
		: { key: Key, value: Value },

	repr ()
		: Repr<Alt<Key, Value>>,
}
