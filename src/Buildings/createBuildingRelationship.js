setup.createBuildingRelationship = (town, building, npc, relationshipObj) => {
  // this can also be used for factions.
  if (!building || !npc || !relationshipObj) {
    console.error('Not enough parameters passed.')
  }
  console.log(building, npc, relationshipObj)
  let existingObj
  town.buildingRelations.find((obj) => {
    if (obj.buildingKey === building.key && obj.npcKey === npc.key) {
      // if there is already an existing relationship between the two, test to see if the relationship needs updating
      Object.keys(relationshipObj).forEach((key) => {
        obj[key] = relationshipObj[key]
      })
      existingObj = true
    }
  })

  if (!existingObj) {
    const newRelationship = {
      key: lib.getUUID(),
      buildingKey: building.key,
      npcKey: npc.key,
      relationship: relationshipObj.relationship,
      reciprocalRelationship: relationshipObj.reciprocalRelationship
    }
    switch (typeof relationshipObj.description) {
      case 'function':
        newRelationship.description = relationshipObj.description(building, npc)
        break
      default:
        newRelationship.description = relationshipObj.description || null
    }
    town.buildingRelations.push(newRelationship)
  }
}
