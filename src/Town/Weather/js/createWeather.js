/**
 * This weather function is pretty complex.
 * Basically, temperature, precipitation,
 * and precipitation intensity are each independently tracked.
 */
setup.createWeather = (town, biome, weather, season, time) => {
  console.groupCollapsed('Creating weather...')

  console.log({ biome, weather, season, time })
  if (biome) {
    switch (biome) {
      case 'desert':
        biome = 'arid'
        break
      case 'town':
        biome = town.terrain || 'temperate'
        break
      default:
        biome = 'temperate'
    }
  }
  biome = biome || town.terrain
  time = time || 8
  season = season || weather.season || 'spring'
  console.log(`biome: ${biome}`)
  if (weather) {
    // if it's passed the weather object (i.e. if it isn't the first time the user has clicked on the button, it doesn't need to set up everything.)
    console.log('Weather was already defined.')
    if (weather.timer) {
      console.log('Counting down timers!')
      weather.timer.precipitation -= time
      weather.timer.temperature -= time
      weather.timer.cloud -= time
    }
  } else {
    const seasonData = setup.townData.terrain[biome].weather.season[season]

    weather = {
      temperature: seasonData.baseTemp || setup.townData.terrain.temperate.weather.season.summer.baseTemp,
      tempVariation: dice(2, 50),
      season,
      timer: {
        precipitation: 0,
        cloud: 0,
        temperature: 0
      },
      roll: {
        precipitationIntensity: random(1, 100),
        precipitation: random(1, 100),
        cloud: random(1, 100)
      },
      readout: {
        precipitation: '',
        cloud: '',
        temperature: ''
      },
      precipitationLevel: seasonData.precipitationLevel,
      precipitationIntensity: seasonData.precipitationIntensity
    }
  }
  // console.log('weather:')
  // console.log(weather)
  weather.precipitationLevel.clamp(1, 4)
  weather.precipitationIntensity.clamp(1, 4)

  setup.renderWeather(town, biome, weather)
  // console.log('weather after render:')
  // console.log(weather)
  console.groupEnd()
  return weather
}
