import { constrainRecord } from '../src/constrainRecord'

interface FactionSlider {
  name: string
  description: string
  preceding: string
}

export const factionSliders = constrainRecord<FactionSlider>()({
  influence: {
    name: 'Influence',
    description: 'How influential is this faction?',
    preceding: 'Faction Influence:'
  },
  reputation: {
    name: 'Reputation',
    description: 'How well known is this faction?',
    preceding: 'Faction Reputation:'
  },
  age: {
    name: 'Age',
    description: 'How old is this faction?',
    preceding: 'Faction Age:'
  },
  size: {
    name: 'Size',
    description: 'How large is this faction?',
    preceding: 'Faction Size:'
  },
  stability: {
    name: 'Stability',
    description: 'How stable is this faction? Is there much in-fighting?',
    preceding: 'Faction Stability:'
  },
  resources: {
    name: 'Resources',
    description: "How many resources are at this faction's disposal?",
    preceding: 'Faction Resources:'
  }
})
