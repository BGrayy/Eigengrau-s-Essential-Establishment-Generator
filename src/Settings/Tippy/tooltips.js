/* global setup tippy jQuery settings */
setup.profileTooltip = function (id, obj) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      if (obj.objectType) {
        switch (obj.objectType) {
          case 'npc':
            span.title = `${lib.articles.output(obj.descriptor).toUpperFirst()} ${obj.profession} with ${obj.physicalTrait} called ${obj.name}`
            break
          case 'building':
            span.title = obj.tippyDescription || `${lib.articles.output(obj.size || obj._size).toUpperFirst()} ${obj.wordNoun || obj.type} that's ${obj.cleanliness || obj._cleanliness}, and is known for ${obj.notableFeature}.`
            break
          case 'faction':
            span.title = obj.tippyDescription || `${lib.articles.output(obj.size).toUpperFirst()} ${obj.type} ${obj.wordNoun} called ${obj.name}`
            break
          case 'guard':
            span.title = obj.tippyDescription || `${obj.name}, the guards.`
            break
        }
      } else {
        span.title = obj.tippyDescription || obj.name
      }
      tippy(`#${span.id}`)
    }
  })
}

setup.itemTooltip = function (id, item) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      span.title = item.description || item
      tippy(`#${span.id}`)
    }
  })
}

setup.profileAgeTooltip = function (id, char) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      span.title = `${char.ageYears} years, to be exact.`
      tippy(`#${span.id}`)
    }
  })
}

setup.profileHeightTooltip = function (id, char, heightVar) {
  if (heightVar) {
    char.heightRoll = heightVar
  }
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      if (settings.showMetric === true) {
        span.title = `${(char.heightRoll * 0.0254).toFixed(2)}m`
        tippy(`#${span.id}`)
      } else {
        const feet = Math.trunc(char.heightRoll / 12)
        const inches = Math.round(char.heightRoll - Math.trunc(feet * 12))
        if (inches === 0) {
          span.title = `${feet}ft. `
        } else {
          span.title = `${feet}ft. ${inches}"`
        }
        tippy(`#${span.id}`)
      }
    }
  })
}

setup.profileWeightTooltip = function (id, char) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      if (settings.showMetric === true) {
        span.title = `${(char.weightRoll / 2.2046).toFixed(1)}kg (with a BMI of ${char.bmi})`
        tippy(`#${span.id}`)
      } else {
        span.title = `${char.weightRoll}lbs. (with a BMI of ${char.bmi})`
      }

      tippy(`#${span.id}`)
    }
  }
  )
}

setup.buildingTooltip = function (id, building) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      span.title = building.tippyDescription || `${lib.articles.output(building.size || building._size).toUpperFirst()} ${building.wordNoun} that's ${building.cleanliness || building._cleanliness}, and is known for ${building.notableFeature}.`
      tippy(`#${span.id}`)
    }
  })
}

setup.politicsTooltip = function (id, type, town) {
  jQuery(() => {
    const span = document.getElementById(id)
    if (span) {
      switch (type) {
        case 'politicalIdeology':
          span.title = lib.townData.politicalIdeology[town.politicalIdeology].data.description
          break
        case 'economicIdeology':
          span.title = lib.townData.economicIdeology[town.economicIdeology].descriptors.tippy
          break
        case 'politicalSource':
          if (town.politicalSource === 'absolute monarchy' || town.politicalSource === 'constitutional monarchy') {
            if (town.politicalIdeology === 'autocracy') {
              span.title = lib.townData.politicalSource[town.politicalSource].autocracy.description
            } else {
              span.title = lib.townData.politicalSource[town.politicalSource].default.description
            }
          } else {
            span.title = lib.townData.politicalSource[town.politicalSource].description
          }
      }
      tippy(`#${span.id}`)
    }
  })
}
