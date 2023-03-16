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
    .map(data => <Component data={ data } />)
    .settle('LOADING', () => <Loading />)
    .settle('ERROR', error => <div className='error'>Error: { error.message }</div>)
    .extract()
  }
  </div>
}
```

## license

ISC, © Strider, 2023.
