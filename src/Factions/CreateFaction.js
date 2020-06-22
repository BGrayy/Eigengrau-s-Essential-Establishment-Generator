setup.createFaction = function (town, opts = {}) {
  // const type = ['thieves', 'merchants', 'wizards', 'rangers', 'seers', 'priests', 'monks', 'assassins', 'artisans', 'nobles', 'bards', 'mercenaries', 'bandits', 'craftsmen', 'scholars'].random()
  const type = opts.type || Object.keys(lib.factionData.type).random()
  // s are defined immediately in case they're needed in the subroutines out of order (i.e. it makes no sense to initialise Size in the size.js function if it's being used in "reputation.js")

  const faction = opts.newFaction || Object.assign({
    key: randomFloat(1).toString(16),
    passageName: 'FactionProfile',
    associatedTown: town.name,
    type,
    objectType: 'faction',
    wordNoun: lib.factionData.type[type].wordNoun,
    motivation: lib.factionData.type[type].motivation.random(),
    membersTrait: lib.factionData.type[type].membersTrait.random(),
    leadershipType: ['individual', 'individual', 'individual', 'group', 'group'].random(),
    roll: {
      influence: lib.dice(2, 50),
      reputation: lib.dice(2, 50),
      age: lib.dice(2, 50),
      size: lib.dice(2, 50),
      stability: lib.dice(2, 50),
      resources: lib.dice(2, 50)
    }
  }, opts)

  if (typeof faction.type === 'undefined') {
    console.error('faction type was not defined! Defaulting to merchants.')
    console.log(faction)
    faction.type = 'merchants'
  }

  lib.setFactionAge(faction)
  lib.setFactionName(town, faction)

  console.groupCollapsed(`${faction.name} the ${faction.type} are loading.`)

  lib.setFactionReputation(faction)
  lib.setFactionSize(town, faction)
  lib.setFactionInfluence(faction)
  setup.resourcesFaction(faction)
  lib.setFactionStability(faction)
  setup.leaderFaction(town, faction)
  lib.setFactionJoinStats(faction)
  lib.createAllies(faction)

  setup.createRivals(faction)
  console.log('other cool bits...')
  lib.setFactionMisc(faction)

  faction.tippyDescription = `${setup.articles.output(faction.size).toUpperFirst()} ${faction.type} ${faction.wordNoun} called ${faction.name}`

  console.groupEnd()
  console.log(`${faction.name} have loaded.`)
  console.log(faction)
  return faction
}
