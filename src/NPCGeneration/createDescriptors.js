
setup.createDescriptors = npc => {
  console.log(`assigning descriptors to ${npc.name}...`)
  // remember adjectival precedence!
  // opinion  size    age   shape       colour  origin  material  purpose     noun
  // lovely   little  old   rectangular green   French  silver    whittling   knife
  const descriptors = [
    `${npc.age || npc.ageStage} ${npc.raceName}`,
    `${npc.height || `${npc.skinColour} skinned`} ${npc.raceName}`,
    `${npc.weight || npc.height} ${npc.raceName}`,
    `${npc.height || npc.age} ${npc.gender} with ${npc.physicalTrait}`
  ]

  if (npc.beard) {
    descriptors.push(`${npc.raceName} with ${setup.articles.output(npc.beard)}`)
  }

  if (npc.hasClass) {
    descriptors.push(npc.dndClass)
  }

  npc.descriptors = descriptors
}
