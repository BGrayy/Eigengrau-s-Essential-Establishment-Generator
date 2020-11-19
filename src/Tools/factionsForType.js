/**
 * Returns a random faction that has a certain attribute.
 *
 * @param town The town object. Like most times it's passed as an argument, it's mandatory here.
 *
 * @param variable The thing that we're searching for.
 * This can be leadershipType, type, etc.
 *
 * @param value The value that is expected for variable.
 * if it doesn't find any, it creates a matching faction.
 * This is for plot hooks that require a wizard's college, etc.
 *
 * @returns {Faction}
 */
setup.factionsForType = (town, variable, value) => {
  const found = []
  for (const faction of Object.values(town.factions)) {
    if (faction[variable] === value) {
      found.push(clone(faction))
    }
  }
  if (found.length === 0) {
    const tempFaction = setup.createFaction(town, {
      [variable]: value,
      isThrowaway: true
    })
    town.factions[tempFaction.key] = tempFaction
    found.push(tempFaction)
  }
  console.log(found)
  return found.random()
}
