
export type Keys = (string | number | symbol)
export type Base = Record<Keys, unknown>


type Expand <M extends Base> = M extends infer MM ? { [ K in keyof MM ]: MM[K] } : never

type Merge <L extends Base, R extends Base> =
{
	[ K in ((keyof L) | (keyof R)) ]:
		(
			(K extends keyof L ? L[K] : never)
		|
			(K extends keyof R ? R[K] : never)
		)
}


export interface Alt <Map extends Base>
{
	is <K extends Keys> (key: K)
		: (keyof Map extends K ? true : K extends keyof Map ? boolean : false)

	extract_on <K extends keyof Map> (key: K)
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
			: Alt<Expand<Merge<
				Omit<Map, From>,
				Record<To, Out>
			>>>,

	map_on <K extends keyof Map, Out> (key: K, fn: (value: Map[K]) => Out)
		: Alt<Expand<Merge<
			Omit<Map, K>,
			Record<K, Out>
		>>>,

	map <Out> (fn: (value: 'OK' extends keyof Map ? Map['OK'] : never) => Out)
		: ('OK' extends keyof Map
			?
				Alt<Expand<Merge<
					Omit<Map, 'OK'>,
					Record<'OK', Out>
				>>>
			:
				never),

	tap_on <K extends keyof Map> (key: K, fn: (value: Map[K]) => void)
		: this,

	tap (fn: (value: 'OK' extends keyof Map ? Map['OK'] : never) => void)
		: ('OK' extends keyof Map ? this : never),

	settle_on <K extends keyof Map, Out> (key: K, fn: (value: Map[K]) => Out)
		: Alt<Expand<Merge<
			Omit<Map, K>,
			Record<'OK', Out>
		>>>,

	settle <Out> (fn: (value: 'FAIL' extends keyof Map ? Map['FAIL'] : never) => Out)
		: ('FAIL' extends keyof Map
			?
				Alt<Expand<Merge<
					Omit<Map, 'FAIL'>,
					Record<'OK', Out>
				>>>
			:
				never),

	unless_on <K extends Keys, Out> (key: K, fn: (value: Map[Exclude<keyof Map, K>]) => Out)
		: (Exclude<keyof Map, K> extends never
			?
				this
			:
				Alt<Expand<Merge<
					Omit<Map, Exclude<keyof Map, K>>,
					Record<K, Out>
				>>>
			),

	unless <Out> (fn: (value: Map[Exclude<keyof Map, 'OK'>]) => Out)
		: (Exclude<keyof Map, 'OK'> extends never ? this
			: Alt<Expand<Merge<Omit<Map, Exclude<keyof Map, 'OK'>>, Record<'OK', Out>>>>),

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
		Alt<Expand<Join2<L, R>>>
	: never
	: never

type Join2 <L extends Base, R extends Base> =
	 'OK' extends keyof L ?
	('OK' extends keyof R ?
		Join3<L, R>
		// (Merge<Omit<L, 'OK'>, Omit<R, 'OK'>>
		// &
		// { OK: [ L['OK'], R['OK'] ] })
	: Merge<Omit<L, 'OK'>, Omit<R, 'OK'>>)
	: L

type Join3 <L extends Base, R extends Base> =
	Merge<Omit<L, 'OK'>, Omit<R, 'OK'>>
	&
	{ OK: [ L['OK'], R['OK'] ] }

		// (Merge<>
		// &
		// { OK: [ L['OK'], R['OK'] ] })
	// Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>>
		// Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & Join<ML, MR>>>
		// Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & { OK: [ ML['OK'], MR['OK'] ] }>>

	/*
		(Left extends Alt<infer ML>
		?
			(Right extends Alt<infer MR>
			?
				Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & Join<ML, MR>>>
				// Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & { OK: [ ML['OK'], MR['OK'] ] }>>
			:
				never
			)
		:
			never
)*/


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
