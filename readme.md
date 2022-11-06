# Alt

Generalization over Option, Either, Result and others for the practical use in JavaScript apps.

```jsx
function View () {
  const [ state, _ ] = useSomeState()

  useEffect(() => {
    state.tap_on('ERROR', error => console.error(error))
  }, [ state ])

  return <div>
  {
    state
    .map(data => <Component data={ data } />)
    .settle_on('LOADING', () => <Loading />)
    .settle_on('ERROR', error => <div className='error'>Error: { error.message }</div>)
    .extract()
  }
  </div>
}
```

## license

ISC, © Strider, 2022.
