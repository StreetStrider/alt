
export type Keys = (string | number | symbol)
export type Base = Record<Keys, unknown>


type Expand <M extends {}> = M extends infer MM ? { [ K in keyof MM ]: MM[K] } : never

type Merge <L extends Base, R extends Base> =
{
	[ K in ((keyof L) | (keyof R)) ]:
		(
			(K extends keyof L ? L[K] : never)
		|
			(K extends keyof R ? R[K] : never)
		)
}

type MapTo
<
	Map extends Base,
	From extends keyof Base,
	To extends Keys,
	Out
>
= Merge<Omit<Map, From>, Record<To, Out>>

type ValuesFor <Map extends Base, Key extends Keys>
= Map[Extract<keyof Map, Key>]

type KeysOther <Map extends Base, Key extends Keys>
= Exclude <keyof Map, Key>


export interface Alt <Map extends Base>
{
	is <K extends Keys> (key: K)
		: (keyof Map extends K ? true : K extends keyof Map ? boolean : false)

	extract <K extends keyof Map> (key: K)
		: (keyof Map extends K ? Map[K] : never),

	extract ()
		: (keyof Map extends 'OK' ? Map['OK'] : never),

	ripout ()
		: (keyof Map extends 'OK' ? Map['OK'] :
			'OK' extends keyof Map ? (Map['OK'] | undefined) : never),

	thru <Out> (fn: (alt: this) => Out)
		: Out,

	chain <K extends keyof Map, Out extends Alt<any>>
		(key: K, fn: (value: Map[K]) => Out)
			: (Out extends Alt<infer MOut>
				? Alt<Expand<Merge<Omit<Map, K>, MOut>>> : never),

	map_to <From extends keyof Map, To extends Keys, Out>
		(from: From, to: To, fn: (value: Map[From]) => Out)
			: Alt<Expand<MapTo<Map, From, To, Out>>>,

	map_to <From extends keyof Map, To extends Keys>
		(from: From, to: To)
			: Alt<Expand<MapTo<Map, From, To, Map[From]>>>,

	map <K extends keyof Map, Out>
		(key: K, fn: (value: Map[K]) => Out)
			: Alt<Expand<MapTo<Map, K, K, Out>>>,

	map <Out> (fn: (value: ValuesFor<Map, 'OK'>) => Out)
		: ('OK' extends keyof Map
			? Alt<Expand<MapTo<Map, 'OK', 'OK', Out>>> : never),

	tap <K extends keyof Map> (key: K, fn: (value: Map[K]) => void)
		: this,

	tap (fn: (value: ValuesFor<Map, 'OK'>) => void)
		: ('OK' extends keyof Map ? this : never),

	settle <K extends keyof Map, Out> (key: K, fn: (value: Map[K]) => Out)
		: Alt<Expand<MapTo<Map, K, 'OK', Out>>>,

	settle <K extends keyof Map> (key: K)
		: Alt<Expand<MapTo<Map, K, 'OK', Map[K]>>>,

	settle <Out> (fn: (value: ValuesFor<Map, 'FAIL'>) => Out)
		: ('FAIL' extends keyof Map
			? Alt<Expand<MapTo<Map, 'FAIL', 'OK', Out>>> : never),

	settle ()
		: ('FAIL' extends keyof Map
			? Alt<Expand<MapTo<Map, 'FAIL', 'OK', Map['FAIL']>>> : never),

	unless <K extends Keys, Out> (key: K, fn: (value: Map[KeysOther<Map, K>]) => Out)
		: (KeysOther<Map, K> extends never
			? this : Alt<Expand<MapTo<Map, KeysOther<Map, K>, K, Out>>>),

	unless <K extends Keys> (key: K)
		: (KeysOther<Map, K> extends never
			? this : Alt<Expand<Record<K, Map[keyof Map]>>>),
			// ? this : Alt<Expand<MapTo<Map, KeysOther<Map, K>, K, Map[KeysOther<Map, K>]>>>),

	unless <Out> (fn: (value: Map[KeysOther<Map, 'OK'>]) => Out)
		: (KeysOther<Map, 'OK'> extends never
			? this : Alt<Expand<MapTo<Map, KeysOther<Map, 'OK'>, 'OK', Out>>>),

	unless ()
		: (KeysOther<Map, 'OK'> extends never
			? this : Alt<Expand<Record<'OK', Map[keyof Map]>>>),
			// ? this : Alt<Expand<MapTo<Map, KeysOther<Map, 'OK'>, 'OK', Map[KeysOther<Map, 'OK'>]>>>),

	debug ()
		: Debug<keyof Map, Map>

	repr ()
		: Repr<this>,
}


//
type Debug <K extends keyof Map, Map> = K extends any ? { key: K, value: Map[K] } : never


//
declare const repr$symbol: unique symbol // = Symbol('repr')

export type Repr <A extends Alt<any>> =
{
	[ repr$symbol ]: A,

	type: 'Alt',
	key: string,
	value: unknown,
}


//
export type Join <
	Left  extends Alt<any>,
	Right extends Alt<any>,
>
=
	Left  extends Alt<infer L> ?
	Right extends Alt<infer R> ?
		Alt<Expand<
			 'OK' extends keyof L ?
			('OK' extends keyof R ?
				(
					JoinMixed<L, R> & { OK: [ L['OK'], R['OK'] ] }
				)
			: JoinMixed<L, R>)
			: L
		>>
	: never
	: never

type JoinMixed <L extends Base, R extends Base>
= Merge<Omit<L, 'OK'>, Omit<R, 'OK'>>


//
export type Result <T, E = unknown> = Alt<
{
	OK: T,
	FAIL: E,
}>

export type ResultLoading <T, E = unknown> = Alt<
{
	OK: T,
	FAIL: E,
	LOADING: void,
}>


//
export type Spread <A extends Alt<any>> =
(A extends Alt<infer M>
?
	(
		M['FAIL'] extends { message: string }
		?
			Alt<Expand<
				Omit<M, 'FAIL'>
				&
				Record<`FAIL:${ M['FAIL']['message'] }`,
					Extract<M['FAIL'], { message: M['FAIL']['message'] }>>>>
		:
		A
	)
:
never)
