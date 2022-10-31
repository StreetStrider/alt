
module.exports =
{
	extends: require.resolve('js-outlander/typescript'),

	rules:
	{
		'@typescript-eslint/no-unused-vars': [ 2, { varsIgnorePattern: '^_$' } ],
	},
}
