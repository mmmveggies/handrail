import pipe from 'ramda/src/pipe'
import K from 'ramda/src/always'
import curry from 'ramda/src/curry'
import identity from 'ramda/src/identity'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'

import {
  judgeObject,
  // allFunctions,
  allPropsAreFunctions,
  rejectNonFunctions
} from './assertions'

import {
  plural,
  GuidedLeft,
  GuidedRight
} from './util'

const safeWarn = curry((scope, input) => judgeObject(
  identity,
  (errors) => (
    new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
  ),
  rejectNonFunctions,
  input
))

const safeRailInputs = function ＸＸＸsafeRailInputs(inputs) {
  // unmetExpectations
  return pipe(
    rejectNonFunctions,
    Object.keys
  )(inputs)
}

// add safety to your pipes!
export const rail = curry(
  function ＸＸＸrail(safety, divider, input) {
    const issues = safeRailInputs({safety, divider})
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

const internalRailSafety = function ＸＸＸinternalRailSafety(expectations) {
  return rail(
    K(allPropsAreFunctions(expectations)),
    K(safeWarn(`handrail`, expectations))
  )
}

export const handrail = curry(
  function ＸＸＸhandrail(safety, badPath, goodPath, input) {
    return pipe(
      // first prove we have good inputs
      internalRailSafety({safety, badPath, goodPath}),
      // then use the functions to create a rail
      multiRail(safety, badPath),
      // then modify your data if the rail
      map(goodPath)
    )(input)
  }
)
