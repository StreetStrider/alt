
export type Key_Base = (string | number | symbol)
export type Map_Base = Record<Key_Base, unknown>

type toMap <A extends Alt<any>> = (A extends Alt<infer M> ? M : never)
// type toValue <A extends Alt<any>, K extends Key_Base> = (A extends Alt<infer M> ? (K extends keyof M ? M[K] : never) : never)
// type toValue <A extends Alt<any>, K extends keyof toMap<A>> = toMap<A>[K]

// type Without <T, K extends keyof T> = { [ K2 in keyof T as (K2 extends K ? never : K2) ]: T[K] }
type Expand <T extends Map_Base> = T extends infer O ? { [ K in keyof O ]: O[K] } : never
type Merge <M1 extends Map_Base, M2 extends Map_Base> =
{
	[ K in ((keyof M1) | (keyof M2)) ]:
		(
			(K extends keyof M1 ? M1[K] : never)
		|
			(K extends keyof M2 ? M2[K] : never)
		)
}

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

type Join2 <M1 extends Map_Base, M2 extends Map_Base> =
	 'OK' extends keyof M1 ?
	('OK' extends keyof M2 ?
		Join3<M1, M2>
		// (Merge<Omit<M1, 'OK'>, Omit<M2, 'OK'>>
		// &
		// { OK: [ M1['OK'], M2['OK'] ] })
	: Merge<Omit<M1, 'OK'>, Omit<M2, 'OK'>>)
	: M1

type Join3 <M1 extends Map_Base, M2 extends Map_Base> =
	Merge<Omit<M1, 'OK'>, Omit<M2, 'OK'>>
	&
	{ OK: [ M1['OK'], M2['OK'] ] }

		// (Merge<>
		// &
		// { OK: [ M1['OK'], M2['OK'] ] })
	// Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>>
		// Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & Join<ML, MR>>>
		// Alt<Expand<Merge<Omit<ML, 'OK'>, Omit<MR, 'OK'>> & { OK: [ ML['OK'], MR['OK'] ] }>>



export interface Alt <Map extends Map_Base>
{
	is <K extends Key_Base> (key: K)
		: (keyof Map extends K ? true : K extends keyof Map ? boolean : false)
		// : this is Alt<{ [ K2 in K ]: Map[K2] }>,
		// : this is Alt<Pick<Map, K>>,

	extract_on <K extends keyof Map> (key: K)
		: (keyof Map extends K ? Map[K] : never),

	extract ()
		: (keyof Map extends 'OK' ? Map['OK'] : never),

	ripout ()
		: (keyof Map extends 'OK' ? Map['OK'] : 'OK' extends keyof Map ? (Map['OK'] | undefined) : never),

	thru <Out> (fn: (alt: this) => Out)
		: Out,

	chain <K extends keyof Map, Out extends Alt<any>>
		(key: K, fn: (value: Map[K]) => Out)
			: Alt<Expand<Merge<Omit<Map, K>, toMap<Out>>>>,
			// : Alt<Expand<Omit<Map, K> & toMap<Out>>>,
			// Alt<Omit<Map, K> & toMap<Out>>
			// : Alt<{ [ K2 in keyof Map ]: K2 extends K ? toValue<Out, K2> : Map[K2] }>,

	map_to <From extends keyof Map, To extends Key_Base, Out>
		(from: From, to: To, fn: (value: Map[From]) => Out)
			: Alt<Expand<Merge<Omit<Map, From>, Record<To, Out>>>>,

	map_on <K extends keyof Map, Out>
		(key: K, fn: (value: Map[K]) => Out)
			: Alt<Expand<Merge<Omit<Map, K>, Record<K, Out>>>>,

	map <Out> (fn: (value: 'OK' extends keyof Map ? Map['OK'] : never) => Out)
		: 'OK' extends keyof Map ? Alt<Expand<Merge<Omit<Map, 'OK'>, Record<'OK', Out>>>> : never,
		// : Alt<Expand<Merge<Omit<Map, 'OK'>, Record<'OK', Out>>>>,

	tap_on <K extends keyof Map>
		(key: K, fn: (value: Map[K]) => void)
			: this,

	tap (fn: (value: 'OK' extends keyof Map ? Map['OK'] : never) => void)
		: 'OK' extends keyof Map ? this : never,

	settle_on <K extends keyof Map, Out>
		(key: K, fn: (value: Map[K]) => Out)
			: Alt<Expand<Merge<Omit<Map, K>, Record<'OK', Out>>>>,
			// : Alt<Omit<Map, K> & Record<'OK', Out>>,

	settle <Out> (fn: (value: 'FAIL' extends keyof Map ? Map['FAIL'] : never) => Out)
		: 'FAIL' extends keyof Map ? Alt<Expand<Merge<Omit<Map, 'FAIL'>, Record<'OK', Out>>>> : never,
		// : Alt<Omit<Map, 'FAIL'> & Record<'OK', Out>>,

	unless_on <K extends Key_Base, Out>
		(key: K, fn: (value: Map[Exclude<keyof Map, K>]) => Out)
			: Exclude<keyof Map, K> extends never ? this
				: Alt<Expand<Merge<Omit<Map, Exclude<keyof Map, K>>, Record<K, Out>>>>,

	unless <Out>
		(fn: (value: Map[Exclude<keyof Map, 'OK'>]) => Out)
			: Exclude<keyof Map, 'OK'> extends never ? this
				: Alt<Expand<Merge<Omit<Map, Exclude<keyof Map, 'OK'>>, Record<'OK', Out>>>>,
				// : Alt<Omit<Map, Exclude<keyof Map, 'OK'>> & Record<'OK', Out>>,

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
					Record<`FAIL:${ M['FAIL']['message'] }`, Extract<M['FAIL'], { message: M['FAIL']['message'] }>>>>
			:
			A
		)
	:
	never)
