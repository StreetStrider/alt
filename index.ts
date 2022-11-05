/* eslint-disable max-len */
/* eslint max-statements: [ 1, 22 ] */

export default Alt
export { OK }
export { FAIL }
export { LOADING }
export { join }
export { attempt }
export { capture }
export { error_spread }
export { load }

export type Key_Base = (string | number | symbol)

export type Repr <_ extends Alt<any, any>> = { type: 'Alt', key: string, value: unknown }

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


function Alt <Key extends Key_Base, Value> (key: Key, value: Value)
	: Alt<Key, Value>
{
	const $key   = key
	const $value = value

	const $alt: Alt<Key, Value> =
	{
		is,
		extract_on,
		extract,
		ripout,
		thru,
		chain,
		map_to,
		map_on,
		map,
		tap_on,
		tap,
		settle_on,
		settle,
		unless_on,
		unless,
		debug,
		repr,
	}

	function is <Key_Possible extends Key_Base> (key: Key_Possible)
		: (Key_Possible extends Key ? true : false)
	{
		return ((key as any) === $key) as any
	}

	function extract_on <Key_Possible extends Key_Base> (key: Key_Possible)
		: (Key_Possible extends Key ? Value : never)
	{
		if (! is(key))
		{
			throw new TypeError(`alt/extract/wrong (key = ${ String($key) }, attempt = ${ String(key) })`)
		}

		return ($value as any)
	}

	function extract (): ('OK' extends Key ? Value : never)
	{
		return extract_on('OK')
	}

	function ripout (): ('OK' extends Key ? Value : undefined)
	{
		if (is('OK'))
		{
			return (value as any)
		}

		return (void 0 as any)
	}

	function thru <Out> (fn: (alt: Alt<Key, Value>) => Out)
		: Out
	{
		return fn($alt)
	}

	function chain <Key_Possible extends Key_Base, Out extends Alt<any, any>>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Out : Alt<Key, Value>)
	{
		if (is(key))
		{
			return fn($value as any)
		}

		return ($alt as any)
	}

	function map_to <Key_From extends Key_Base, Key_To extends Key_Base, Out>
		(from: Key_From, to: Key_To, fn: (value: (Key_From extends Key ? Value : never)) => Out)
			: (Key_From extends Key ? Alt<Key_To, Out> : Alt<Key, Value>)
	{
		return chain(from, value => Alt(to, fn(value)))
	}

	function map_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Alt<Key_Possible, Out> : Alt<Key, Value>)
	{
		return map_to(key, key, fn) as any
	}

	function map <Out> (fn: (value: ('OK' extends Key ? Value : never)) => Out)
		: ('OK' extends Key ? Alt<'OK', Out> : Alt<Key, Value>)
	{
		return map_on('OK', fn)
	}

	function tap_on <Key_Possible extends Key_Base>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => void)
			: Alt<Key, Value>
	{
		if (is(key))
		{
			fn($value as any)
		}

		return $alt
	}

	function tap (fn: (value: ('OK' extends Key ? Value : never)) => void)
		: Alt<Key, Value>
	{
		return tap_on('OK', fn)
	}

	function settle_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? Value : never)) => Out)
			: (Key_Possible extends Key ? Alt<'OK', Out> : Alt<Key, Value>)
	{
		return map_to(key, 'OK', fn) as any
	}

	function settle <Out> (fn: (value: ('FAIL' extends Key ? Value : never)) => Out)
		: ('FAIL' extends Key ? Alt<'OK', Out> : Alt<Key, Value>)
	{
		return settle_on('FAIL', fn)
	}

	function unless_on <Key_Possible extends Key_Base, Out>
		(key: Key_Possible, fn: (value: (Key_Possible extends Key ? never : Value)) => Out)
			: Alt<Key_Possible, Key extends Key_Possible ? Value : Out>
	{
		if (is(key))
		{
			return ($alt as any)
		}

		return Alt(key, fn($value as any) as any)
	}

	function unless <Out> (fn: (value: ('OK' extends Key ? never : Value)) => Out)
		: Alt<'OK', Key extends 'OK' ? Value : Out>
	{
		return unless_on('OK', fn)
	}

	function debug ()
	{
		return { key: $key, value: $value }
	}

	function repr ()
	{
		return { type: 'Alt', key: $key, value: $value } as any
	}

	return $alt
}


function OK <Value> (value: Value)
{
	return Alt('OK', value)
}

function FAIL <Value> (value: Value)
{
	return Alt('FAIL', value)
}

function LOADING ()
{
	return Alt('LOADING', void 0)
}


function join
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
{
	return (left as any)
	.chain('OK', (left_v: any) => (right as any)
	.map((right_v: any) => [ left_v, right_v ]))
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


function attempt <T, E = unknown> (fn: () => T): Result<T, E>
{
	try
	{
		return OK(fn())
	}
	catch (e)
	{
		return FAIL(e as any)
	}
}


async function capture <T, E = unknown> (fn: () => (Promise<T> | T)): Promise<Result<T, E>>
{
	try
	{
		return OK(await fn())
	}
	catch (e)
	{
		return FAIL(e as any)
	}
}


function error_spread <T extends Alt<any, any>> (alt: T)
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
{
	return alt.chain('FAIL', (error) => Alt(`FAIL:${ error.message }`, error) as any)
}


function load <A extends Alt<any, any>, R extends Repr<A>> (repr: R): A
{
	if (repr?.type !== 'Alt') throw new TypeError('alt/load/wrong')
	if (! repr.key) throw new TypeError('alt/load/nokey')

	return Alt(repr.key, repr.value) as any
}
