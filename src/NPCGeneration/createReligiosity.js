setup.createReligiosity = function (town, npc) {
  console.log(`Creating religion strength for ${npc.name}`)
  npc.roll.religiosity = Math.fairmath(dice(2, 40) + 10, town.roll.religiosity - 50)
  Math.clamp(npc.roll.religiosity, 1, 100)

  console.log(`Creating religion strength for ${npc.name}`)
  console.log(npc)
  // TODO: transfer religiosity to the religion object; for some reason the defineRollDataGetter isn't playing nicely with it.
  // setup.defineRollDataGetter(npc, setup.npcData.religion, 'religiosity', 'religiosity')
  if (!npc.religion.strength) {
    const temp = setup.npcData.religion.strength.find(function (desc) {
      return desc[0] <= npc.roll.religiosity
    })
    npc.religion.strength = temp[1]
    if (typeof npc.religion.strength === 'undefined') {
      npc.religion.strength = 'quiet true believer'
    }
  }
}
