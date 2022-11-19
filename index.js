/* eslint-disable max-len */
/* eslint max-statements: [ 1, 21 ] */
/* eslint-disable @typescript-eslint/no-unused-expressions */

exports.Alt = Alt

var idem = (_ => _)

function Alt (key, value)
{
	const $key = key

	const $alt =
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
		tap,
		settle_on,
		settle,
		unless_on,
		unless,
		debug,
		repr,
	}

	function is (key)
	{
		return (key === $key)
	}

	function extract_on (key)
	{
		if (! is(key))
		{
			throw new TypeError(`alt/extract/wrong (key = ${ String($key) }, attempt = ${ String(key) })`)
		}

		return value
	}

	function extract ()
	{
		return extract_on('OK')
	}

	function ripout ()
	{
		if (is('OK'))
		{
			return value
		}
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
		fn || (fn = idem)

		return chain(from, value => Alt(to, fn(value)))
	}

	function map_on (key, fn)
	{
		return map_to(key, key, fn)
	}

	function map (fn)
	{
		return map_on('OK', fn)
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

	function settle_on (key, fn)
	{
		return map_to(key, 'OK', fn)
	}

	function settle (fn)
	{
		return settle_on('FAIL', fn)
	}

	function unless_on (key, fn)
	{
		fn || (fn = idem)

		if (is(key))
		{
			return $alt
		}

		return Alt(key, fn(value))
	}

	function unless (fn)
	{
		return unless_on('OK', fn)
	}

	function debug ()
	{
		return { key, value }
	}

	function repr ()
	{
		return { type: 'Alt', key, value }
	}

	return $alt
}


exports.load = function load (repr)
{
	if (repr?.type !== 'Alt') throw new TypeError('alt/load/wrong')
	if (! repr.key) throw new TypeError('alt/load/nokey')

	return Alt(repr.key, repr.value)
}


exports.join = function join (left, right)
{
	return left.chain('OK', L => right.map(R => [ L, R ]))
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

exports.LOADING = function LOADING (value)
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
