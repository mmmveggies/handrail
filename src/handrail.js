import pipe from 'ramda/src/pipe'
import K from 'ramda/src/always'
import curry from 'ramda/src/curry'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'

import {
  judgeObject,
  allFunctions,
  rejectNonFunctions
} from './assertions'

import {
  plural,
  GuidedLeft,
  GuidedRight
} from './util'

/*
const xtrace = curry((l, a, b) => {
  l(a, b) // eslint-disable-line
  return b
})
const trace = xtrace(console.log)
// */

const safeWarn = curry((scope, input) => judgeObject(
  identity,
  (errors) => (
    new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
  ),
  rejectNonFunctions,
  input
))

// add safety to your pipes!
export const rail = curry(
  function ＸＸＸrail(safety, divider, input) {
    // unmetExpectations
    const issues = pipe(
      rejectNonFunctions,
      Object.keys
    )({
      safety,
      divider
    })
    if (issues.length > 0) {
      return GuidedLeft(
        new Error(
          `rail: Expected ${issues.join(`, `)} to be function${plural(issues)}.`
        )
      )
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

const internalRailSafety = curry(
  function ＸＸＸinternalRailSafety(safety, badPath, goodPath) {
    // TODO convert this so that we can cache `{safety, badPath, goodPath}` and use it in both
    return rail(
      K(allFunctions([safety, badPath, goodPath])),
      K(safeWarn(`handrail`, {safety, badPath, goodPath}))
    )
  }
)

export const handrail = curry(
  function ＸＸＸhandrail(safety, badPath, goodPath, input) {
    return pipe(
      // first prove we have good inputs
      internalRailSafety(safety, badPath, goodPath),
      // then use the functions to create a rail
      multiRail(safety, badPath),
      // then modify your data if the rail
      map(goodPath)
    )(input)
  }
)
