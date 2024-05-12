/* eslint-disable max-len */
/* eslint-disable max-statements */

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
		extract_of,
		extract,
		thru,
		chain,
		map_to,
		map_of,
		map,
		tap_of,
		tap,
		settle_of,
		settle,
		unless_of,
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

	function extract_of (key, raise_fn)
	{
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

	function extract (raise_fn)
	{
		return extract_of('OK', raise_fn)
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

	function map_of (key, fn)
	{
		return map_to(key, key, fn)
	}

	function map (fn)
	{
		return map_of('OK', fn)
	}

	function tap_of (key, fn)
	{
		if (is(key))
		{
			fn(value)
		}

		return $alt
	}

	function tap (fn)
	{
		return tap_of('OK', fn)
	}

	function settle_of (key, fn)
	{
		return map_to(key, 'OK', fn)
	}

	function settle (fn)
	{
		return settle_of('FAIL', fn)
	}

	function unless_of (key, fn)
	{
		if (is(key))
		{
			return $alt
		}

		return map_to($key, key, fn)
	}

	function unless (fn)
	{
		return unless_of('OK', fn)
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

 exports.PROGRESS = PROGRESS
function PROGRESS (value)
{
	return Alt('PROGRESS', value)
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


exports.capture = capture
async function capture (fn)
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


exports.progress = async function progress (fn, fn_setter)
{
	fn_setter(PROGRESS())

	const value = await capture(fn)
	fn_setter(value)

	return value
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
