import { BackgroundName } from './backgroundTraits'
import { ClassName } from './classTraits'
import { RaceName, GenderName, AgeName } from './raceTraits'

export type SocialClassName =
  | 'indentured servitude'
  | 'paupery'
  | 'peasantry'
  | 'commoner'
  | 'nobility'
  | 'aristocracy'

export interface NPC {
  key: string
  passageName: string
  name: string
  formalName: string
  title: string
  lastName: string
  firstName: string
  gender: GenderName
  race: RaceName
  beard: string
  skinColour: string
  heightRoll: number
  height: string
  weightRoll: number
  weight: string
  raceRoll: number
  bmi: number
  muscleMass: number
  physicalTrait: string
  age: string
  ageStage: AgeName
  ageYears: number
  adventure?: string
  profession: string
  background: BackgroundName
  roll: Record<string, number>
  partnerID?: string
  relationships: Record<string, string>
  wealth: number
  finances: {
    creditors: Record<string, number>
    debtors: Record<string, number>
  }
  religion: {
    strength: string
  }
  socialClass: SocialClassName
  professionType: string
  professionSector: string
  hasClass: boolean
  dndClass?: ClassName
  weapon?: string
  canBeCustom?: boolean
  isThrowaway?: boolean
  isShallow?: boolean
  hasHistory?: boolean
  isBreakingGenderNorms: boolean
  keyIsAlreadyDefined?: boolean
  trait: string
  calmTrait: string
  stressTrait: string
  relaxedTrait: string
  vocalPattern: string
  pronouns: {
    heshe: string
    hisher: string
    himher: string
    himherself: string
    malefemale: string
    manwoman: string
    boygirl: string
  }
  heshe: string
  hisher: string
  himher: string
  himherself: string
  malefemale: string
  manwoman: string
  boygirl: string
  parentNoun: string
  siblingNoun: string
  niblingNoun: string
  childNoun: string
  note?: string
  descriptors: string[]
  descriptor: string
  backgroundOrigin: string
  birthplace: string
  siblingNumber: number
  childhoodMemories: string
  family: string
  familyHome: string
  familyLifestyle: string
  familyUnit: string
  knewParents: boolean
  bond: string
  ideal: string
  greeting?: string[]
  death?: {
    cause: string
    timeSinceDeath: number
  }
}

export interface Relationship {
  relationship: string
  reciprocalRelationship?: string
  probability: number
  base: {
    profession?: string
    socialClass?: string
  }
  exclusions?(town: unknown, npc: NPC): boolean | undefined
}
