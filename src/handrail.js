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

const yell = curry((scope, errors) => (
  new Error(`${scope}: Expected ${errors.join(`, `)} to be function${plural(errors)}.`)
))

const safeWarn = curry((scope, input) => judgeObject(
  identity,
  yell(scope),
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
  function ＸＸＸrail(assertion, wrongPath, input) {
    const issues = safeRailInputs({assertion, wrongPath})
    if (issues.length > 0) {
      return GuidedLeft(yell(`rail`, issues))
    }
    return (
      assertion(input) ?
      GuidedRight :
      pipe(wrongPath, GuidedLeft)
    )(input)
  }
)

export const multiRail = curry(
  function ＸＸＸmultiRail(assertion, wrongPath, input) {
    return chain(
      rail(assertion, wrongPath),
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
  function ＸＸＸhandrail(assertion, wrongPath, rightPath, input) {
    return pipe(
      // first prove we have good inputs
      internalRailSafety({assertion, wrongPath, rightPath}),
      // then use the functions to create a rail
      multiRail(assertion, wrongPath),
      // then modify your data if we're on the Right path
      map(rightPath)
    )(input)
  }
)
