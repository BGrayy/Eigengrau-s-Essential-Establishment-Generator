setup.createReligiosity = (town, npc) => {
  console.log(`Creating religion strength for ${npc.name}`)
  npc.roll.religiosity = lib.fm(lib.dice(2, 40) + 10, town.roll.religiosity - 50)
  npc.roll.religiosity = Math.clamp(npc.roll.religiosity, 1, 100)

  console.log(`Creating religion strength for ${npc.name}`)
  console.log(npc)
  // TODO: transfer religiosity to the religion object; for some reason the defineRollDataGetter isn't playing nicely with it.
  // lib.defineRollDataGetter(npc, setup.npcData.religion, 'religiosity', 'religiosity')
  if (!npc.religion.strength) {
    npc.religion.strength = getReligionStrength(npc.roll.religiosity)
  } else {
    const temp = setup.npcData.religion.strength.find(desc => {
      return desc[1] === npc.religion.strength
    })
    npc.roll.religiosity = temp[0] + random(1, 5)
  }
}

/**
 * @param {number} religiosityRoll
 * @returns {string}
 */
function getReligionStrength (religiosityRoll) {
  for (const [threshold, strength] of setup.npcData.religion.strength) {
    if (threshold <= religiosityRoll) {
      return strength
    }
  }
  return 'quiet true believer'
}
