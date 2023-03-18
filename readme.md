# Alt

Generalization over Option, Either, Result and others for the practical use in JavaScript apps.

```jsx
function View () {
  const [ state, _ ] = useSomeState()

  useEffect(() => {
    state.tap('ERROR', error => console.error(error))
  }, [ state ])

  return <div>
  {
    state
    .map('OK', data => <Component data={ data } />)
    .settle('LOADING', () => <Loading />)
    .settle('ERROR', error => <div className='error'>Error: { error.message }</div>)
    .extract()
  }
  </div>
}
```

`extract` takes OK value out of the Alt. It is exhaustive. If Alt is not settled to OK only it will return `unknown` type in static time and throw in run time.

## license

ISC, © Strider, 2023.
