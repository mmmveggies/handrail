import pipe from 'ramda/src/pipe'
import K from 'ramda/src/always'
import curry from 'ramda/src/curry'
import reject from 'ramda/src/reject'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'

import {denounceObject} from './assertions'

import {
  plural,
  isFn,
  GuidedLeft,
  GuidedRight,
  allFunctions
} from './util'

/*
const xtrace = curry((l, a, b) => {
  l(a, b) // eslint-disable-line
  return b
})
const trace = xtrace(console.log)
// */

// add safety to your pipes!
export const rail = curry(
  function ＸＸＸrail(safety, divider, input) {
    if (!isFn(safety)) {
      return GuidedLeft(`rail: Expected safety to be a function.`)
    }
    if (!isFn(divider)) {
      return GuidedLeft(`rail: Expected divider to be a function.`)
    }
    return (
      safety(input) ?
      GuidedRight :
      pipe(divider, GuidedLeft)
    )(input)
  }
)

export const multiRail = curry(
  function ＸＸＸmultiRail(safety, divider, input) {
    return chain(
      rail(safety, divider),
      input
    )
  }
)

const safeWarn = curry(
  function ＸＸＸsafeWarn(safety, badPath, goodPath) {
    return denounceObject(
      identity,
      (errors) => (
        new Error(`handrail: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
      ),
      reject(isFn),
      {
        safety,
        badPath,
        goodPath
      }
    )
  }
)

const internalRailSafety = curry(
  function ＸＸＸinternalRailSafety(safety, badPath, goodPath) {
    return rail(
      K(allFunctions([safety, badPath, goodPath])),
      K(safeWarn(safety, badPath, goodPath))
    )
  }
)

export const handrail = curry(
  function ＸＸＸhandrail(safety, badPath, goodPath, input) {
    return pipe(
      internalRailSafety(safety, badPath, goodPath),
      multiRail(safety, badPath),
      map(goodPath)
    )(input)
  }
)
