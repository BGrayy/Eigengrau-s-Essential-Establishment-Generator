setup.createTown = function (base) {
  if (!base) {
    base = {
    }
  }

  const type = base.type || ['hamlet', 'hamlet', 'village', 'village', 'village', 'town', 'town', 'town', 'city', 'city'].random()
  const terrain = base.terrain || ['temperate', 'temperate', 'temperate', 'tropical', 'polar', 'arid'].random()
  const season = base.season || ['summer', 'autumn', 'winter', 'spring'].random()
  const townName = base.name || setup.createTownName()
  console.groupCollapsed(`${townName} is loading...`)
  console.log(base)
  const politicsWeightedRoll = (size, type) => {
    let totalWeight = 0
    const loc = lib.townData.type[size].ideologies[type]
    const pool = Object.keys(loc)
    pool.forEach(key => {
      totalWeight += lib.townData.type[size].ideologies[type][key]
    })
    let random = Math.floor(randomFloat(1) * totalWeight)
    let selected
    for (let i = 0; i < pool.length; i++) {
      random -= loc[pool[i]]
      if (random < 0) {
        // console.log('Less than zero! Found one.')
        // console.log(pool[i])
        selected = pool[i]
        break
      }
    }
    return selected
  }

  const economicIdeology = base.economicIdeology || politicsWeightedRoll(type, 'economicIdeology')
  const politicalSource = base.politicalSource || politicsWeightedRoll(type, 'politicalSource')
  const politicalIdeology = base.politicalIdeology || lib.townData.politicalSource[politicalSource].politicalIdeology.random()
  const town = Object.assign({
    passageName: 'TownOutput',
    name: townName,
    objectType: 'town',
    townMaterial: 'mainTownMaterial',
    ignoreGender: false,
    taxes: {
      base: 5,
      land: 5,

      // get military () {
      //   return 1
      //   // return (this.roll.military / 50)
      // },
      tithe: 1
    },
    taxRate (town) {
      let totalTax = 0
      Object.keys(town.taxes).forEach(tax => {
        // if (tax === 'land') {
        // totalTax += (town.taxes[tax] * (setup.socialClass[npc.socialClass].landRate || 1))
        // } else if (typeof town.taxes[tax] === 'number') {
        if (typeof town.taxes[tax] === 'number') {
          totalTax += town.taxes[tax]
        } else if (typeof town.taxes[tax] === 'function') {
          const temp = town.taxes[tax](this)
          totalTax += temp
        } else {
          console.log(`non-integer tax! ${town.taxes[tax]}`)
        }
      })
      return Math.round(totalTax * 100) / 100
    },
    get type () {
      // console.log('Getting town type.')
      if (this.population > 3000) {
        return 'city'
      } else if (this.population > 1000) {
        return 'town'
      } else if (this.population > 300) {
        return 'village'
      } else if (this.population > 30) {
        return 'hamlet'
      } else if (this.population <= 30) {
        console.log('Population is less than 30. Setting to 30.')
        this.population = 30
        return 'hamlet'
      }
    },
    set type (value) {
      console.log('Setting town type.')
      this._type = value
    },
    // type: type,
    terrain,
    currentSeason: season,
    season,
    factions: {
    },
    buildings: [],
    families: {
    },
    population: lib.townData.type[type].population(),
    _demographicPercentile: {},
    // Clone the raw demographic data for the town type.
    // _baseDemographics: clone(lib.townData.type['hamlet'].demographics.random().output),
    get baseDemographics () {
      console.log('Getting base demographics.')
      return this._baseDemographics
    },
    set baseDemographics (newDemographics) {
      console.log('Setting base demographics.')
      if (!this._baseDemographics) this._baseDemographics = {}
      Object.keys(newDemographics).forEach(byRace => {
        this._baseDemographics[byRace] = newDemographics[byRace]
      })
      console.log(this.demographicPercentile)
    },
    get demographicPercentile () {
      console.log('Getting demographic percent.')

      // Get an array of the demographic keys (race names).
      const races = Object.keys(this.baseDemographics)

      // Calculate the sum of the raw demographic values.
      const sum = races
        .map(byRace => this.baseDemographics[byRace])
        .reduce((acc, cur) => acc + cur, 0)

      // Calculate the demographic percentages.
      races.forEach(byRace => {
        this._demographicPercentile[byRace] = this.baseDemographics[byRace] / sum * 100
      })
      return this._demographicPercentile
    },
    set demographicPercentile (data) { console.log('Setter for demographicPercentile is not a thing. Chucking out the following data:', data) },
    _economicIdeology: economicIdeology,
    _politicalSource: politicalSource,
    _politicalIdeology: politicalIdeology,
    get economicIdeology () {
      // console.log(`Getting town economic ideology - ${this._economicIdeology}`)
      return this._economicIdeology
    },
    set economicIdeology (value) {
      // console.log('Setting town economic ideology.')
      this._economicIdeology = value
      Object.assign(this, lib.townData.economicIdeology[this._economicIdeology].descriptors)
    },
    get politicalSource () {
      // console.log(`Getting town political source - ${this._politicalSource}`)
      return this._politicalSource
    },
    set politicalSource (value) {
      // console.log('Setting town political source.')
      this._politicalSource = value
    },
    get politicalIdeology () {
      // console.log(`Getting town political ideology - ${this._politicalIdeology}`)
      return this._politicalIdeology
    },
    set politicalIdeology (value) {
      // console.log('Setting town political ideology.')
      this._politicalIdeology = value
      Object.assign(this, lib.townData.politicalIdeology[this._politicalIdeology].data)
    },
    get politicalSourceDescription () {
      // console.log('Getting town political source description.')
      if (this._politicalSource === 'absolute monarchy' || this._politicalSource === 'constitutional monarchy') {
        if (this.politicalIdeology === 'autocracy') {
          return lib.townData.politicalSource[this._politicalSource].autocracy.politicalSourceDescription
        } else {
          return lib.townData.politicalSource[this._politicalSource].default.politicalSourceDescription
        }
      } else {
        return lib.townData.politicalSource[this._politicalSource].politicalSourceDescription
      }
    },
    get wealth () {
      // console.log('Getting town wealth.')
      let wealth = lib.townData.rollData.wealth.find(descriptor => {
        return descriptor[0] <= this.roll.wealth
      })
      if (wealth === undefined) {
        console.log(`Could not find a wealth descriptor that was appropriate for a roll of ${this.roll.wealth} for ${this.name}`)
        wealth = lib.townData.rollData.wealth[lib.townData.rollData.wealth.length - 1]
      }
      this._wealth = wealth[1]
      return this._wealth
    },
    set wealth (value) {
      // console.log('Setting town wealth.')
      this._wealth = value
    },
    roads: {},
    location: lib.terrain[terrain].start.random(),
    primaryCrop: lib.townData.misc.primaryCrop.random(),
    primaryExport: lib.townData.misc.primaryExport.random(),
    landmark: lib.townData.misc.landmark.random(),
    currentEvent: lib.townData.misc.currentEvent.random(),
    microEvent: lib.townData.misc.microEvent,
    dominantGender: ['man', 'man', 'man', 'man', 'man', 'woman', 'woman'].random(),
    roll: {
      wealth: lib.dice(2, 50),
      reputation: lib.dice(2, 50),
      religiosity: lib.dice(2, 50),
      sin: lib.dice(2, 50),
      diversity: lib.dice(2, 50),
      magic: lib.dice(2, 50),
      size: random(1, 100),
      economics: lib.dice(2, 50),
      welfare: lib.dice(3, 33) - 10,
      military: lib.dice(2, 50),
      law: lib.dice(2, 50),
      arcana: lib.dice(2, 50),
      equality: lib.dice(2, 50) - 20
    }
  }, base)

  setup.townDemographics(town)
  town.professions = setup.fetchProfessions(town)

  town.economicIdeology = town.economicIdeology || town._economicIdeology
  town.politicalIdeology = town.politicalIdeology || town._politicalIdeology
  town.politicalSource = town.politicalSource || town._politicalSource
  town.origin = town.origin || lib.terrain[town.terrain].location[town.location].origin.random()
  town.vegetation = town.vegetation || lib.weightRandom(lib.terrain[town.terrain].location[town.location].vegetation)
  town.materialProbability = setup.structureData.material.types

  console.log('Defining taxes')
  Object.defineProperty(town.taxes, 'welfare', {
    get () {
      console.log(this)
      // TODO fix the getter's workaround.
      const tempWelfare = State.variables.town.roll.welfare
      const welfarePercentile = tempWelfare
      const nominalTarget = 2
      const result = nominalTarget + (-1 / (welfarePercentile + 0.1)) + (1 / (10 - welfarePercentile))
      return result
      // return (this.roll.welfare / 50)
    }
  })

  Object.defineProperty(town.taxes, 'military', {
    get () {
      console.log(this)
      // TODO fix the getter's workaround.
      const tempMilitary = State.variables.town.roll.military
      const militaryPercentile = tempMilitary
      const nominalTarget = 2
      const result = nominalTarget + (-1 / (militaryPercentile + 0.1)) + (1 / (10 - militaryPercentile))
      return result
      // return (this.roll.military / 50)
    }
  })

  Object.defineProperty(town.taxes, 'economics', {
    get () {
      console.log(this)
      // TODO fix the getter's workaround.
      const economics = State.variables.town.roll.economics
      const nominalTarget = 3
      const result = nominalTarget + (-1 / (economics + 0.1)) + (1 / (10 - economics))
      return result
    }
  })

  town.guard = setup.createGuard(town)

  if (!town.pregen) {
    console.log(`Assigning town size modifiers (btw ${town.name} is a ${town.type})`)
    Object.keys(lib.townData.type[town.type].modifiers).forEach(modifier => {
      town.roll[modifier] = lib.fm(town.roll[modifier], lib.townData.type[town.type].modifiers[modifier])
    })

    console.log(`Assigning economic modifiers (btw ${town.name} is a ${town.economicIdeology})`)
    // economic ideology attribute modifiers

    Object.keys(lib.townData.economicIdeology[town.economicIdeology].modifiers).forEach(modifier => {
      console.log(lib.townData.economicIdeology[town.economicIdeology].modifiers[modifier])
      town.roll[modifier] = lib.fm(town.roll[modifier], lib.townData.economicIdeology[town.economicIdeology].modifiers[modifier])
    })
    // political ideology modifiers
    console.log(`Assigning political ideology modifiers (btw ${town.name} is a ${town.politicalIdeology})`)

    Object.keys(lib.townData.politicalIdeology[town.politicalIdeology].modifiers).forEach(modifier => {
      console.log(modifier)
      console.log(lib.townData.politicalIdeology[town.politicalIdeology].modifiers[modifier])
      town.roll[modifier] = lib.fm(town.roll[modifier], lib.townData.politicalIdeology[town.politicalIdeology].modifiers[modifier])
    })
  // Object.assign(town.leader, lib.townData.politicalIdeology[town.politicalIdeology].data)
  }

  setup.createSocioPolitics(town)

  Object.keys(town.roll).forEach(roll => {
    town.roll[roll].clamp(1, 100)
  })
  if (settings.ignoreGender === true || town.ignoreGender === true) {
    town.roll.equality = 100
  }
  town.equality = ''
  town.equalityDescription = ''
  lib.defineRollDataGetter(town, lib.townData.rollData.equality[town.dominantGender], 'equality', 'equality', 1)
  lib.defineRollDataGetter(town, lib.townData.rollData.equality[town.dominantGender], 'equalityDescription', 'equality', 2)
  const possibleMaterials = lib.terrain[town.terrain].location[town.location].possibleMaterials
  town.townMaterial = setup.createTownMaterial(possibleMaterials, town.roll.wealth, town.roll.size)
  lib.townRender(town)
  setup.createStartBuildings(town)
  setup.createStartFactions(town)
  lib.setMaterialProbability(town, possibleMaterials)

  console.groupEnd()
  // setup.createWeather(town)
  console.log(`${town.name} has loaded.`)
  console.log(town)
  // console.log('loaded', town.wealth, town.roll.size)
  // confirm(town.townMaterial)
  return town
}
