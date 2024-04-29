/* eslint-disable max-len */

exports.Alt = Alt

function Alt (key, value)
{
	const $key = key

	const $alt =
	{
		debug,
		repr,
		is,
		ripout,
		extract,
		thru,
		chain,
		map_to,
		map,
		tap,
		settle,
		unless,
		join,
	}

	function debug ()
	{
		return { key, value }
	}

	function repr ()
	{
		return { type: 'Alt', key, value }
	}

	function is (key)
	{
		return (key === $key)
	}

	function ripout ()
	{
		if (is('OK'))
		{
			return value
		}
	}

	function extract (key, raise_fn)
	{
		if (typeof key === 'function')
		{
			raise_fn = key
			key = 'OK'
		}
		else if (key == null)
		{
			key = 'OK'
		}

		if (! is(key))
		{
			if (raise_fn)
			{
				throw raise_fn($key, key)
			}
			else
			{
				throw new TypeError(`alt/extract/wrong (key = ${ String($key) }, attempt = ${ String(key) })`)
			}
		}

		return value
	}

	function thru (fn)
	{
		return fn($alt)
	}

	function chain (key, fn)
	{
		if (is(key))
		{
			return fn(value)
		}

		return $alt
	}

	function map_to (from, to, fn)
	{
		fn ?? (fn = (_ => _))

		return chain(from, value => Alt(to, fn(value)))
	}

	function map (key, fn)
	{
		if (typeof key === 'function')
		{
			fn  = key
			key = 'OK'
		}

		return map_to(key, key, fn)
	}

	function tap (key, fn)
	{
		if (typeof key === 'function')
		{
			fn  = key
			key = 'OK'
		}

		if (is(key))
		{
			fn(value)
		}

		return $alt
	}

	function settle (key, fn)
	{
		if (typeof key === 'function')
		{
			fn  = key
			key = 'FAIL'
		}
		else if (key == null)
		{
			key = 'FAIL'
		}

		return map_to(key, 'OK', fn)
	}

	function unless (key, fn)
	{
		if (typeof key === 'function')
		{
			fn  = key
			key = 'OK'
		}
		else if (key == null)
		{
			key = 'OK'
		}

		if (is(key))
		{
			return $alt
		}

		return map_to($key, key, fn)
	}

	function join (right)
	{
		return j($alt, right)
	}

	return $alt
}


exports.load = function load (repr)
{
	if (repr?.type !== 'Alt') throw new TypeError('alt/load/wrong')
	if (! repr.key) throw new TypeError('alt/load/nokey')

	return Alt(repr.key, repr.value)
}


function join (left, right)
{
	return left.chain('OK', L => right.map(R => [ L, R ]))
}

exports.join = join

const j = join


// TODO: coalesce
exports.coalesce = function coalesce (key, alts, fallback_fn)
{
	for (const alt of alts)
	{
		if (alt.is(key))
		{
			return alt
		}
	}

	return fallback_fn(alts)
}


 exports.OK = OK
function OK (value)
{
	return Alt('OK', value)
}

 exports.FAIL = FAIL
function FAIL (value)
{
	return Alt('FAIL', value)
}

 exports.LOADING = LOADING
function LOADING (value)
{
	return Alt('LOADING', value)
}


exports.attempt = function attempt (fn)
{
	try
	{
		return OK(fn())
	}
	catch (e)
	{
		return FAIL(e)
	}
}


exports.capture = async function capture (fn)
{
	try
	{
		return OK(await fn())
	}
	catch (e)
	{
		return FAIL(e)
	}
}


// TODO: progress
exports.progress = async function progress (fn, fn_setter)
{
	try
	{
		fn_setter(LOADING())
		fn_setter(OK(await fn()))
	}
	catch (e)
	{
		fn_setter(FAIL(e))
	}
}


exports.error_spread = function error_spread (alt)
{
	return alt.chain('FAIL', (error) =>
	{
		if ('message' in Object(error))
		{
			return Alt(`FAIL:${ error.message }`, error)
		}
		else
		{
			return alt
		}
	})
}
