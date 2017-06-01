import curry from 'ramda/src/curry'
import pipe from 'ramda/src/pipe'

export const denounceObject = curry(
  (transform, explanation, assertion, properties) => pipe(
    assertion,
    transform,
    Object.keys,
    explanation
  )(properties)
)
