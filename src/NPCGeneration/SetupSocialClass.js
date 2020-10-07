/** @type {[number, string, number][]} */
const socialClasses = [
  [195, 'aristocracy', 5],
  [95, 'aristocracy', 5],
  [80, 'nobility', 4],
  // [75, 'high class'],
  // [65, 'upper-middle class'],
  [60, 'commoner', 3],
  // [40, 'lower-middle class'],
  [20, 'peasantry', 2],
  [10, 'paupery', 1],
  [0, 'indentured servitude', 0]
]

const socialClassArray = [
  'indentured servitude',
  'paupery',
  'peasantry',
  'commoner',
  'nobility',
  'aristocracy'
]

const socialClassKeys = {
  'aristocracy': 5,
  'nobility': 4,
  'commoner': 3,
  'peasantry': 2,
  'paupery': 1,
  'indentured servitude': 0
}

// TODO: concatenate these four arrays and objects into one object.
// too lazy to do it right now. Sorry.
setup.socialClass = {
  'aristocracy': {
    roll: 95,
    key: 5,
    landRate: 3, // landRate is a multiple
    lifestyle: ['aristocratic']
  },
  'nobility': {
    roll: 80,
    key: 4,
    landRate: 2,
    lifestyle: ['aristocratic', 'wealthy', 'comfortable']
  },
  'commoner': {
    roll: 60,
    key: 3,
    landRate: 1,
    lifestyle: ['comfortable', 'modest', 'poor']
  },
  'peasantry': {
    roll: 20,
    key: 2,
    landRate: 0.5,
    lifestyle: ['modest', 'poor', 'squalid']
  },
  'paupery': {
    roll: 10,
    key: 1,
    landRate: 0,
    lifestyle: ['poor', 'squalid', 'wretched']
  },
  'indentured servitude': {
    roll: 0,
    key: 0,
    landRate: 0,
    lifestyle: ['squalid', 'wretched']
  }
}

setup.createSocialClass = function (town, npc) {
  console.log('Creating social class...')

  if (!npc.roll) {
    npc.roll = {}
  }
  const profession = lib.findProfession(town, npc)

  npc.roll.socialClass = npc.roll.socialClass || profession.socialClassRoll() || 40 + lib.dice(8, 6)

  console.log({ npc })
  if (!npc.socialClass) {
    console.log(`Social class not predefined. Searching for the social class of a ${npc.profession}...`)
    // if .socialClass is defined in the professions.js, then that's all dandy.
    if (profession.socialClass) {
      npc.socialClass = profession.socialClass
      return npc
    // otherwise, just roll some dice.
    } else {
      console.log(`No synonyms found for ${npc.dndClass}`)
      const array = socialClasses.find(desc => {
        return desc[0] <= npc.roll.socialClass
      })
      npc.socialClass = array[1]
      console.log(`Unidentified profession- ${npc.profession} does not exist in townData.professions!`)
    }
  }
  if (npc.socialClass === undefined) {
    console.log(`Failed to set a social class that matched the roll of ${npc.roll.socialClass} for ${npc.name}.`)
    npc.socialClass = socialClasses[random(0, socialClasses.length - 1)]
  }
  return npc
}

/**
 * Introduce modifiers for adult family members.
 * @type {[number, number][]}
 */
const adultSocialMobilityTable = [
  [6, -2],
  [18, -1],
  [60, 0],
  [14, 1],
  [2, 2]
]

setup.relativeSocialClass = function (npcClass) {
  let classIndex = socialClassKeys[npcClass]
  if (classIndex < 0) classIndex = 3

  const delta = lib.rollFromTable(adultSocialMobilityTable, 100)

  const newIndex = Math.clamp(classIndex + delta, 0, socialClassArray.length - 1)
  return socialClassArray[newIndex]
}

setup.familySocialClass = function (marriage) {
  if (marriage.parents.length === 0) {
    if (marriage.children.length === 0) {
      return 'commoner'
    }
    return State.variables.npcs[marriage.children[0]].socialClass
  }

  const classArray = marriage.parents.map(key =>
    socialClassKeys[State.variables.npcs[key].socialClass]
  )
  const mean = Math.round(classArray.reduce((a, b) => a + b) / classArray.length)
  return socialClassArray[mean]
}
