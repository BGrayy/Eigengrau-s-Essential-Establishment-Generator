setup.createGeneralStoreName = function (town, generalStore) {
  // var name
  const roll = dice(1, 7)
  const adjective = ['Dependable', 'Reliable', 'Expendable', 'Indispensible', 'Incomparable', 'Incredible', 'Excellent', 'Important', 'Cheap', 'Affordable', 'Affable', 'Discount', 'Low-Cost', 'Fancy'].seededrandom()
  const noun = ['Mount', 'Saddle', 'Guild', 'Fangs', 'Man', 'Pardon', 'Pleasure', 'Belt', 'Staff', 'Shield', 'Prince', 'Master', 'Servant', 'Meal', 'Prince', 'Favor', 'Love', 'Word', 'Scribe', 'Apprentice', 'Acolyte', 'Dress', 'Goddess', 'God', 'Gold', 'Purse', 'Trap', 'King', 'Son', 'Sister', 'Mother', 'Daughter', 'Cry', 'Shout', 'Cupboard', 'Pantry', 'Queen', 'Wealth', 'Star', 'Void', 'Woman', 'Man', 'Whore', 'Butcher', 'Anvil', 'Tome', 'Sacrifice', 'Armor', 'Cup', 'Pot', 'Stove', 'Stool', 'Princess', 'Chain', 'Sword', 'Pork', 'Grain', 'Tooth', 'Lance', 'Axe', 'Scabbard', 'Knife', 'Dagger', 'Spear', 'Bow', 'Crossbow', 'Quarterstaff', 'Staff', 'Fire', 'Ice', 'Wind', 'Earth', 'Water', 'Stone', 'Ladle', 'Monastery', 'Chalice', 'Goblet', 'Dungeon', 'Lust', 'Lantern', 'Bone', 'Life', 'Stone', 'Mistress', 'Mind', 'Treasure', 'Barter', 'Armorer', 'Butler', 'Page', 'Tome', 'Feather', 'Shadow', 'Friend', 'Labyrinth', 'Mountain', 'Hope', 'Boot', 'Gauntlet'].seededrandom()
  const family = ['son', 'daughter', 'brother', 'sister', 'uncle', 'aunt', 'father', 'friend', 'family', 'employee'].seededrandom()
  const rider = ['Shop', 'Bazaar', 'Convenience Store', 'Trading Post', 'Warehouse', 'Antiquerie', 'Adventure Supplier', 'Supplier', 'Goods', 'Goods and Bads', 'Stock Shop', 'Wares'].seededrandom()
  const fam = {
    son: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.parentNoun
      },
      gender: 'man',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'young adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    daughter: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.parentNoun
      },
      gender: 'woman',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'young adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    brother: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.siblingNoun
      },
      gender: 'man',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: generalStore.shopkeep.ageStage,
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    sister: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.siblingNoun
      },
      gender: 'woman',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: generalStore.shopkeep.ageStage,
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    uncle: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.niblingNoun
      },
      gender: 'man',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'settled adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    aunt: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.niblingNoun
      },
      gender: 'woman',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'settled adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    father: {
      relationships: {
        [generalStore.shopkeep.key]: generalStore.shopkeep.childNoun
      },
      gender: 'man',
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'settled adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    friend: {
      relationships: {
        [generalStore.shopkeep.key]: 'friend'
      },
      ageStage: 'settled adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    family: {
      relationships: {
        [generalStore.shopkeep.key]: 'relative'
      },
      race: generalStore.shopkeep.race,
      lastName: generalStore.shopkeep.lastName,
      ageStage: 'settled adult',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    },
    employee: {
      relationships: {
        [generalStore.shopkeep.key]: 'employer'
      },
      gender: 'man',
      profession: ['shopkeep', "shopkeep's assistant", "shopkeep's assistant", "shopkeep's assistant"].seededrandom()
    }
  }

  switch (roll) {
    case 1:
      generalStore.name = `The ${adjective} ${noun}`
      break
    case 2:
      generalStore.name = `${generalStore.shopkeep.firstName} and ${family.toUpperFirst()}`
      generalStore.assistant = setup.createNPC(town, fam[family])
      setup.createRelationship(town, generalStore.shopkeep, generalStore.assistant, family, generalStore.assistant.relationships[generalStore.shopkeep.key])
      break
    case 3:
      generalStore.name = `The ${noun} and ${family.toUpperFirst()}`
      generalStore.assistant = setup.createNPC(town, fam[family])
      setup.createRelationship(town, generalStore.shopkeep, generalStore.assistant, family, generalStore.assistant.relationships[generalStore.shopkeep.key])
      break
    case 4:
      generalStore.name = `The ${adjective} ${rider}`
      break
    case 5:
      generalStore.name = `The ${adjective} ${noun}`
      break
    case 6:
      generalStore.name = generalStore.shopkeep.firstName + ["'s General Goods", "'s Bric-a-Brac", "'s Trading Goods", "'s Shopping Place", `'s ${rider}`].seededrandom()
      break
    case 7:
      generalStore.name = `${generalStore.shopkeep.firstName}'s ${adjective} ${rider}`
      break
    default:
      generalStore.name = `The ${adjective} Adventurer's Store`
      break
  }
  return generalStore
}
