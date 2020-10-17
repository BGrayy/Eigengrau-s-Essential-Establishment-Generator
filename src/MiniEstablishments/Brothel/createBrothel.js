setup.createBrothel = (town, tavern) => {
  console.log('Creating a brothel...')
  const brothel = setup.createBuilding(town, 'brothel')

  Object.assign(brothel, {
    name: setup.brothel.name.random(),
    passageName: 'BrothelOutput',
    initPassage: 'BrothelOutput',
    buildingType: 'brothel',
    wordNoun: ['brothel', 'whorehouse', "gentleman's club", 'bordello', 'cathouse', 'house of ill-repute', 'massage parlor', 'den of vice'].random(),
    specialty: setup.brothel.specialty.random(),
    talk: setup.brothel.talk().random(),
    rumour: setup.brothel.rumour.random(),
    notice: setup.brothel.notice().random(),
    idle: setup.brothel.idle().random(),
    owner: Object.keys(setup.brothel.pimp).random()
  })
  brothel.notableFeature = `${brothel.specialty} and being owned by ${brothel.owner}`
  setup.createStructure(town, brothel)
  brothel.structure.descriptor = `${lib.articles.output(brothel.structure.material.wealth)} ${brothel.structure.material.noun} ${brothel.wordNoun} with ${lib.articles.output(brothel.structure.roof.verb)} roof`
  const rollDataVariables = ['wealth', 'size', 'cleanliness']
  for (const propName of rollDataVariables) {
    lib.defineRollDataGetter(brothel, setup.brothel.rollData, propName)
  }
  brothel.associatedNPC = setup.createNPC(town, {
    ...setup.brothel.pimp[brothel.owner],
    isShallow: true,
    hasClass: false
  })
  brothel.associatedNPC.title = lib.genderData[brothel.associatedNPC.gender].domTitle
  brothel.associatedNPC.greeting = [
    'nods at you', 'welcomes you warmly', 'smiles, greets you', 'raises a hand with a wave', 'sizes you up, before $associatedNPC.heshe nods at you', 'checks you out for just a moment before smiling at you', 'waves slightly in your direction', 'gives you you a slight nod', 'turns your way', 'frowns, but greets you just the same'
  ]
  lib.createBuildingRelationship(town, brothel, brothel.associatedNPC, { relationship: 'pimp', reciprocalRelationship: 'business', description: `Owns ${brothel.name}.` })
  console.log(brothel)
  return brothel
}
