
setup.createSocioPolitics = function (town) {
  console.groupCollapsed('Creating sociopolitics!')
  // ecoIde and polSource are now set in the createTown.js function

  // // give those ideologies some descriptions
  town = Object.assign(town, lib.townData.economicIdeology[town.economicIdeology].descriptors)
  // // data
  town = Object.assign(town, lib.townData.politicalIdeology[town.politicalIdeology].data)

  // deletes town leaders if they are defined. Commented out because I'd prefer to leave ex-prime ministers in than delete somebody's valuable NPC.
  // if (town.leader) {
  //   delete State.variables.npcs[town.leader.key]
  //   delete town.leader
  // }
  // if (town.ruler) {
  //   delete State.variables.npcs[town.ruler.key]
  //   delete town.ruler
  // }

  switch (town.politicalSource) {
    case 'absolute monarchy':
      switch (town.politicalIdeology) {
        case 'autocracy':
          town.dualLeaders = false
          console.log('Loaded autocratic absolute monarchy')
          town.leader = setup.createNPC(town, { background: 'noble', profession: 'noble' })
          // switch (town.ruler.gender) {
          //   case 'woman':
          //     town.rulerType = 'Queen'
          //     break
          //   default:
          //     town.rulerType = 'King'
          //     break
          // }
          break
        default:
          console.log(`Loaded ${lib.articles.output(town.politicalIdeologyIC)} absolute monarchy`)
          setup.createTownLeader(town)
          town.dualLeaders = true
          town.ruler = setup.createNPC(town, { title: 'Royal Highness', background: 'noble', profession: 'noble' })
      }
      break
    case 'constitutional monarchy':
      switch (town.politicalIdeology) {
        case 'autocracy':
          town.dualLeaders = true
          console.log('Loaded autocratic constitutional monarchy')
          town.ruler = setup.createNPC(town, { title: 'Royal Highness', background: 'noble', profession: 'noble' })
          town.leader = setup.createNPC(town, { title: 'Lord', background: 'noble', profession: 'politician' })
          // switch (town.ruler.gender) {
          //   case 'woman':
          //     town.rulerType = 'Queen'
          //     break
          //   default:
          //     town.rulerType = 'King'
          //     break
          // }
          break
        default:
          console.log(`Loaded ${lib.articles.output(town.politicalIdeologyIC)} constitutional monarchy`)
          town.ruler = setup.createNPC(town, { title: 'Royal Highness', background: 'noble', profession: 'noble' })
          setup.createTownLeader(town)
      }
      break
    default:
      console.log(`Loaded ${lib.articles.output(town.politicalIdeologyIC)} ${town.politicalSource}`)
      setup.createTownLeader(town)
      town.dualLeaders = false
  }

  // switch (town.politicalIdeology) {
  //   case 'autocracy':
  //     switch (town.politicalSource) {
  //       case 'absolute monarchy':
  //         town.dualLeaders = false
  //         console.log('Loaded autocratic absolute monarchy')
  //         town.leader = setup.createNPC(town, { background: 'noble', profession: 'noble' })
  //         switch (town.ruler.gender) {
  //           case 'woman':
  //             town.rulerType = 'Queen'
  //             break
  //           default:
  //             town.rulerType = 'King'
  //             break
  //         }
  //         break
  //       case 'constitutional monarchy':
  //         town.dualLeaders = true
  //         console.log('Loaded autocratic constitutional monarchy')
  //         town.ruler = setup.createNPC(town, { title: 'Royal Highness', background: 'noble', profession: 'noble' })
  //         town.leader = setup.createNPC(town, { title: 'Lord', background: 'noble', profession: 'politician' })
  //         // town.politicalSourceDescription = "<<print $town.leader.title.toUpperFirst()>> <<profile $town.leader>> is the supreme ruler, and all laws and affairs are governed by the crowns' will."
  //         switch (town.ruler.gender) {
  //           case 'man':
  //             town.rulerType = 'King'
  //             break
  //           case 'woman':
  //             town.rulerType = 'Queen'
  //             break
  //           default:
  //             town.rulerType = 'the supreme leader'
  //         }
  //         break
  //       default:
  //         town.leaderType = 'the supreme leader'
  //         town.dualLeaders = false
  //         town.leader = setup.createNPC(town, { title: 'Lord', background: 'noble', profession: 'politician' })
  //     }
  //     break
  //   default:
  //     town.dualLeaders = false
  //     town.leaderType = lib.townData.politicalIdeology[town.politicalIdeology].data.leaderType || 'commoners'
  //     if (typeof lib.townData.politicalIdeology[town.politicalIdeology].leaderTraits !== 'undefined') {
  //       town.leader = setup.createNPC(lib.townData.politicalIdeology[town.politicalIdeology].leaderTraits)
  //     } else {
  //       console.log('Invalid political ideology of ' + town.politicalIdeology + '. Leader defaulting to random NPC...')
  //       town.leader = setup.createNPC(town)
  //     }
  // }
  console.log('Town faction leadership...')
  const politicalIdeology = lib.townData.politicalIdeology[town.politicalIdeology]

  if (politicalIdeology.data.isFaction === true) {
    console.log('Loading ruling faction...')
    delete State.variables.npcs[town.leader.key]
    delete town.leader
    const type = politicalIdeology.data.governmentType
    if (politicalIdeology.data.governmentType !== lib.factionData.type[type]) {
      console.log(`No faction that matches ${politicalIdeology.data.governmentType}. Creating random faction instead...`)
      town.factions.leader = setup.createFaction(town, {
        leadershipType: 'individual',
        isPoliticalPower: true,
        key: 'leader'
      })
    } else {
      town.factions.leader = setup.createFaction(town, {
        leadershipType: 'individual',
        isPoliticalPower: true,
        type: politicalIdeology.data.governmentType,
        key: 'leader'
      })
    }
    console.log('Town factions:')
    console.log(town.factions)
    town.leader = town.factions.leader.leader
    town.leaderType = '<<profile $town.factions["leader"]>>'
    // town.leaderType = '<<link ' + JSON.stringify(town.factions['leader'].name) + '>><<set $currentPassage to {key: ' + JSON.stringify(town.factions['leader'].key) + '}>><<goto "FactionProfile">><</link>>'
    console.log('Town factions:')
    console.log(town.factions)
  } else if (politicalIdeology.data.isFaction === false && town.factions.leader) {
    delete State.variables.npcs[town.leader.key]
    delete town.leader
    delete town.factions.leader
  }

  console.groupEnd()
  return town
}

setup.createTownLeader = function (town) {
  console.log('Creating town leader')
  const politicalIdeology = lib.townData.politicalIdeology[town.politicalIdeology]
  town.leaderType = politicalIdeology.data.leaderType || 'commoners'
  if (typeof politicalIdeology.leaderTraits !== 'undefined') {
    town.leader = setup.createNPC(town, politicalIdeology.leaderTraits())
  } else {
    console.log(`Invalid political ideology of ${town.politicalIdeology}. Leader defaulting to random NPC...`)
    town.leader = setup.createNPC(town, {
      profession: 'politician'
    })
  }
  console.log('Town leader:')
  console.log(town.leader)
  return town
}
