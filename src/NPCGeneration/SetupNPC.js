setup.createNPC = function (town, base) {
  if (!town) {
    console.error('Town is not defined! NPC cannot be created. Please report this bug.')
  }
  lib.filterNull(base)
  console.log('Base:')
  console.log({ base })
  // These are the very basic bits that need to be defined first- race, gender, and then names using those local variables.
  const data = setup.npcData

  if (!base) {
    base = {
      isShallow: true
    }
  }
  if (base.isShallow === true) {
    console.log('NPC flagged as shallow.')
    base.isThrowaway = base.isThrowaway || true
    // base.canBeCustom = base.canBeCustom || true
    base.hasHistory = base.hasHistory || false
  }

  if (base.canBeCustom === true && random(1, 100) > 99) {
    base = lib.objectArrayFetcher(lib.patreonCharacters)
  }

  lib.initSexistProfession(town, base)

  const gender = base.gender || ['man', 'woman'].random()
  const race = base.race || lib.fetchRace(town, base)

  console.log('Fetching profession.')
  const profession = base.profession || lib.fetchProfessionChance(town, base)

  const firstName = base.firstName || lib.raceTraits[race].genderTraits[gender].firstName.random().toUpperFirst()
  const lastName = base.lastName || lib.raceTraits[race].lastName.random().toUpperFirst()
  console.groupCollapsed(`${firstName} ${lastName}`)
  const ageStage = base.ageStage || ['young adult', 'young adult', 'young adult', 'young adult', 'settled adult', 'settled adult', 'settled adult', 'elderly'].random()
  let dndClass
  if (lib.findProfession(town, base, profession).type === 'dndClass') {
    base.hasClass = true
    // eslint-disable-next-line no-unused-vars
    dndClass = base.dndClass || profession
  }

  // the local variables are then assigned to npc. We don't need to initialise npc to do the stuff that's race & gender dependent because we've got the local variables.
  const npc = Object.assign({
    key: base.key || randomFloat(0, 1),
    objectType: 'npc',
    passageName: 'NPCProfile',
    _gender: gender,
    _race: race,
    firstName,
    lastName,
    get name () {
      return `${this.firstName} ${this.lastName}`
    },
    set name (name) {
      const words = name.toString().split(' ')
      this.firstName = words[0] || ''
      this.lastName = words[1] || ''
    },
    ageStage,
    ageYears: lib.raceTraits[race].ageTraits[ageStage].baseAge + lib.raceTraits[race].ageTraits[ageStage].ageModifier(),
    muscleMass: lib.raceTraits[race].muscleMass + lib.dice(5, 4) - 12,
    pronouns: {

    },
    relationships: {

    },
    religion: {

    },
    roll: {
      _wageVariation: lib.dice(5, 10) - 27,
      wageVariation (town) {
        // _wageVariation is static; it's the "luck" that the NPC has in their profession.
        // town.roll.wealth increases or decreases it by 10%, reflecting the strength of the economy.
        // expected range should be between -25 and 25.
        return lib.calcPercentage(npc.roll._wageVariation, (town.roll.wealth - 50) / 5)
      },
      physicalTrait: random(1, 100),
      gregariousness: lib.dice(3, 6),
      // conformity: 1 is a sheep, 50 is a regular person, 100 is "call the cops cuz i really don't care"
      // TODO: conformity would ideally be used in testing for breaking gender norms, but it is only initialised AFTER the test.
      // not really sure how to go about fixing it.
      conformity: lib.dice(2, 50)
    },
    finances: {
      creditors (town, npc) {
        return {}
      },
      debtors (town, npc) {
        return {}
      },
      grossIncome (town, npc) {
        // TODO add hobbies
        console.log(`Returning ${npc.name}'s gross income...`)
        const profession = lib.findProfession(town, npc)
        return Math.round(lib.calcPercentage(profession.dailyWage, (npc.roll.wageVariation(town), (town.roll.wealth - 50) / 3)))
      },
      netIncome (town, npc) {
        console.log(`Returning ${npc.name}'s net income...`)
        return Math.round(lib.calcPercentage(npc.finances.grossIncome(town, npc), -setup.npcTaxRate(town, npc)))
      },
      lifestyleStandard (town, npc) {
        console.log(`Returning ${npc.name}'s lifestyle standard...`)
        const income = npc.finances.netIncome(town, npc)
        let lifestyleStandard
        for (lifestyleStandard of lib.lifestyleStandards) {
          if (income >= lifestyleStandard[0]) {
            return lifestyleStandard
          }
        }
        // lifestyleStandard returns the unmodified array of [100, 'modest', 30]
        // various bits use all three, so it was easier to specify which than create three virtually identical functions.
        return lifestyleStandard
      },
      lifestyleExpenses (town, npc) {
        console.log(`Returning ${npc.name}'s lifestyle expenses...`)
        const income = npc.finances.grossIncome(town, npc)
        const living = npc.finances.lifestyleStandard(town, npc)
        const ratio = lib.lifestyleStandards.find(desc => {
          return desc[1] === living[1]
        })
        return Math.round(income * (ratio[2] / 100))
      },
      profit (town, npc) {
        console.log(`Returning ${npc.name}'s profit...`)
        return Math.round(npc.finances.netIncome(town, npc) - npc.finances.lifestyleStandard(town, npc)[0] - npc.finances.lifestyleExpenses(town, npc))
      }
    },
    hairColour: data.hairColour.random(),
    hairType: data.hairType.random(),
    get hair () {
      return `${this.hairType} ${this.hairColour} hair`
    },
    set hair (hair) {
      const hairs = hair.toString().split(' ')
      this.hairType = hairs[0] || ''
      this.hairColour = hairs[1] || ''
    },
    get descriptor () {
      return this.descriptors.random()
    },
    eyes: lib.raceTraits[race].eyes.random(),
    skinColour: data.skinColour.random(),
    dndClass,
    profession,
    pockets: data.pockets.random(),
    wealth: lib.dice(2, 50),
    trait: data.trait.random(),
    currentMood: data.currentMood,
    hasHistory: base.hasHistory || false,
    // id: Math.floor(randomFloat(1) * 0x10000),
    idle: data.idle,
    get gender () {
      return this._gender
    },
    set gender (gender) {
      this._gender = gender
      Object.assign(this, lib.genderData[gender])
    },
    get race () {
      return this._race
    },
    set race (race) {
      this._race = race
      Object.assign(this, lib.raceTraits[race].raceWords)
    },
    get raceNote () {
      if (this._race === 'human') {
        return `${this.height} ${this.gender}`
      } else {
        return lib.raceTraits[this._race].raceWords.raceName
      }
    },
    knownLanguages: lib.raceTraits[race].knownLanguages,
    reading: data.reading.random(),

    family: undefined
    // pubRumour: setup.createPubRumour()
  }, base)

  npc.gender = npc.gender || npc._gender
  npc.race = npc.race || npc._race
  // npc.key = randomFloat(0, 1)
  Object.assign(npc, lib.genderData[npc.gender])
  Object.assign(npc.pronouns, lib.genderData[npc.gender])

  Object.assign(npc, lib.raceTraits[npc.race].raceWords)
  npc.availableLanguages = [data.standardLanguages.concat(data.exoticLanguages) - npc.knownLanguages]

  if (typeof npc.hasClass === 'undefined') {
    if (lib.findProfession(town, npc).type !== 'dndClass') {
      npc.hasClass = false
      // npc.dndClass = npc.profession
    } else {
      npc.hasClass = true
      npc.adventure = data.adventure.random() || 'looking for work'
      npc.dndClass = npc.dndClass || npc.profession
    }
  }

  setup.createPersonality(npc)
  // setup.createName(npc)

  lib.setAge(npc)

  lib.setRace(npc)

  if (!npc.physicalTrait) {
    if (npc.roll.physicalTrait > 40) {
      const hair = setup.npcData.bodyParts.head.hair.random()
      const eyes = setup.npcData.bodyParts.head.eyes.random()
      const nose = setup.npcData.bodyParts.head.nose.random()
      const mouth = setup.npcData.bodyParts.head.mouth.random()
      const chin = setup.npcData.bodyParts.head.chin.random()
      const ears = setup.npcData.bodyParts.head.ears.random()
      const headMisc = setup.npcData.bodyParts.head.misc.random()
      npc.physicalTrait = [hair, eyes, nose, mouth, chin, ears, headMisc].random()
    } else if (npc.roll.physicalTrait > 30) {
      npc.physicalTrait = setup.npcData.bodyParts.torso.descriptions.random()
    } else if (npc.roll.physicalTrait > 20) {
      npc.physicalTrait = setup.npcData.bodyParts.arms.descriptions.random()
    } else if (npc.roll.physicalTrait > 13) {
      npc.physicalTrait = setup.npcData.bodyParts.legs.descriptions.random()
    } else if (npc.roll.physicalTrait > 8) {
      npc.physicalTrait = data.scar.random()
    } else if (npc.roll.physicalTrait > 5) {
      npc.physicalTrait = npc.hair
    } else if (npc.roll.physicalTrait <= 5) {
      npc.physicalTrait = data.tattoo.random()
    }
  }
  setup.createClass(town, npc)

  setup.createBackground(npc)

  setup.createDescriptors(npc)
  npc.formalName = npc.formalName || `${npc.title} ${npc.lastName}`
  // npc.key = npc.name
  if (!npc.keyIsAlreadyDefined) State.variables.npcs[npc.key] = npc

  npc.profile = function (npc, base) {
    base = npc.name || base
    return `<<profile \`$npcs[${JSON.stringify(npc.key)}] \`${JSON.stringify(base)}>>`
  }

  setup.createSexuality(npc)
  setup.createSocialClass(town, npc)
  setup.createLifestyleStandards(town, npc)
  setup.createReligiosity(town, npc)

  if (npc.finances.profit(town, npc) < 0 && npc.isShallow !== true) {
    setup.createDebt(town, npc)
  }
  if (npc.hasHistory !== false) setup.expandNPC(town, npc)

  State.temporary.newNPC = npc

  if (npc.callbackFunction) {
    npc.callbackFunction(town, npc, base)
  }

  console.log(npc)
  console.groupEnd()
  return npc
}
