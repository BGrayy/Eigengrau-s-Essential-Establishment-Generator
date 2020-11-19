// TODO: convert
setup.familyRelationships = {
  // Specific names when traversing the family tree
  // (the bracketed ones should never occur)
  // the capital letters stand for the four types of relationship:
  // B = brother / sister
  // C = couple (marriage)
  // D = descendant (child)
  // E = elder (parent)
  nouns: {
    Em: 'father',
    Ew: 'mother',
    Dm: 'son',
    Dw: 'daughter',
    Bm: 'brother',
    Bw: 'sister',
    Cm: 'husband',
    Cw: 'wife',
    EEm: 'grandfather',
    EEw: 'grandmother',
    EDm: 'half-brother',
    EDw: 'half-sister',
    EBm: 'uncle',
    EBw: 'aunt',
    ECm: 'stepfather',
    ECw: 'stepmother',
    DEm: '(self/partner)',
    DEw: '(self/partner)',
    DDm: 'grandson',
    DDw: 'granddaughter',
    DBm: '(son)',
    DBw: '(daughter)',
    DCm: 'son-in-law',
    DCw: 'daughter-in-law',
    BEm: '(father)',
    BEw: '(mother)',
    BDm: 'nephew',
    BDw: 'niece',
    BBm: '(brother)',
    BBw: '(sister)',
    BCm: 'brother-in-law',
    BCw: 'sister-in-law',
    CEm: 'father-in-law',
    CEw: 'mother-in-law',
    CDm: 'stepson',
    CDw: 'stepdaughter',
    CBm: 'brother-in-law',
    CBw: 'sister-in-law',
    CCm: 'co-husband',
    CCw: 'co-wife'
  },
  verbose: (key) => {
    if (key in setup.familyRelationships.nouns) return setup.familyRelationships.nouns[key]
    return 'relative'
  },
  inverse: (npc, key) => {
    let inverse = ''
    for (let i = 0; i < key.length - 1; i++) {
      if (key[i] === 'E') {
        inverse = `${inverse}D`
      } else if (key[i] === 'D') {
        inverse = `${inverse}E`
      } else {
        inverse = inverse + key[i]
      }
    }
    return inverse.split('').reverse().join('') + npc.gender[0]
  }
}

// TODO: convert
setup.knewParents = function (town, npc) {
  if (!npc) return false
  const family = town.families[npc.family]
  const node = family.members[npc.key]
  return !!node.parentMarriage
}

// TODO: convert
setup.getMarriages = function (town, npc) {
  if (!npc) return []
  const family = town.families[npc.family]
  const node = family.members[npc.key]
  return !!node.parentMarriage
}

// uses State.variables.npcs
setup.getFatherMother = function (town, npc) {
  let father, mother

  const family = town.families[npc.family]
  const node = family.members[npc.key]

  if (node.parentMarriage) {
    father = node.parentMarriage.parents.find(key => {
      return State.variables.npcs[key].gender === 'man'
    })
    mother = node.parentMarriage.parents.find(key => {
      return State.variables.npcs[key].gender === 'woman'
    })
  }

  return { father, mother }
}
