/**
 * @param town Needed because everything needs town to evaluate
 *
 * @param args The object containing the objects that you're drawing from
 *
 * @param obj The optional npc, building, or whatever that is needed for functions.
 *
 * @param exclusionFunction The optional global exclusion testing function;
 * this is for things like pulling just the paper type objects from plothooks.
 * Saves on LoC. Leave exclusionFunction blank if everything in your object is
 * always going to be allowed.
 *
 * @param output What should be outputted at the end. Set to 'object' to return the whole object.
 * defaultProbability is the optional default unit. You won't usually need to supply this.
 */
setup.weightedRandomFetcher = function (town, args, obj, exclusionFunction, output, defaultProbability) {
  // console.log(args)
  console.groupCollapsed('Running a weighted random search...')
  console.log({
    args,
    obj,
    exclusionFunction,
    output,
    defaultProbability
  })

  if (!output) {
    output = 'function'
  }
  if (!defaultProbability) {
    defaultProbability = 10
  }

  const pool = []
  let totalWeight = 0

  for (const arg of Object.values(args)) {
    let isValid
    let fnValid
    // console.log(arg)
    if (arg.exclusions && typeof arg.exclusions === 'function') {
      isValid = arg.exclusions(town, obj)
    } else {
      isValid = true
    }
    if (arg.probability <= 0) {
      isValid = false
    }

    // console.log('fnValid: ')
    // console.log(arg)
    if (typeof exclusionFunction === 'function') {
      fnValid = exclusionFunction(town, arg)
    } else {
      fnValid = true
    }

    // console.log(fnValid)
    if (isValid === true && fnValid === true) {
      pool.push(arg)
      totalWeight += arg.probability || defaultProbability
    }
  }
  // console.log('Starting the search.')
  let random = Math.floor(randomFloat(1) * totalWeight)
  let selected
  for (const item of pool) {
    random -= item.probability || defaultProbability
    if (random < 0) {
      // console.log('Less than zero! Found one.')
      // console.log(pool[i])
      selected = item
      break
    }
  }

  console.log(selected)
  if (!selected[output] && output !== 'object') {
    console.error(`The randomly fetched object does not have the attribute ${output}.`)
    console.log({ selected })
  }
  console.groupEnd()
  if (output === 'object') {
    // if the string 'object' is passed, then it returns the object itself.
    console.log(selected)
    return selected
  } else if (typeof selected[output] === 'function') {
    const value = selected[output](town, obj)
    console.log(value)
    return value
  } else {
    console.log(selected[output])
    return selected[output]
  }
}
