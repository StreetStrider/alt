
module.exports =
{
	env:
	{
		mocha: true,
	},

	rules:
	{
		'max-len': 0,
		'max-statements-per-line': [ 1, { max: 3 } ],
		'max-nested-callbacks': [ 1, { max: 4 } ],
	},
}
