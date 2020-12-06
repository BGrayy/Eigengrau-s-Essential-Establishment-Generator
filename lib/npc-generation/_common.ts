import { Town } from '../town/_common'
import { BackgroundName } from './backgroundTraits'
import { ClassName } from './classTraits'
import { ReligionStrength } from './createReligiosity'
import { ProfessionNames, ProfessionSector, ProfessionType } from './professions'
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
  objectType: string
  passageName: string
  name: string
  formalName: string
  title: string
  lastName: string
  firstName: string
  gender: GenderName
  race: RaceName
  raceName: RaceName
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
  profession: ProfessionNames
  /**
   * @description In the style of Xanathar's Class Origins, for the professions.
   */
  professionOrigin: string
  professionSuccess: string
  background: BackgroundName
  roll: {
    /** How lucky/good someone is at their job. */
    professionLuck: number
    /** "Rarity" of the trait- not really a super important attribute. */
    physicalTrait: number
    /** 100 is an exceedingly charismatic person, 1 is uber-awkward. */
    gregariousness: number
    /** 100 is a sheep, 50 is a regular person, 1 is "call the cops cuz i really don't care" */
    conformity: number
    /** The number used to determine their gender. */
    gender: number
    /** How religious they are */
    religiosity: number
  }
  partnerID?: string
  lifeEvents: string[]
  callbackFunction?(town: Town): any
  wealth: number
  finances: {
    creditors: Record<string, number>
    debtors: Record<string, number>
  }
  religion: {
    strength: ReligionStrength
  }
  socialClass: SocialClassName
  professionType: ProfessionType
  professionSector: ProfessionSector
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
  /**
   * @description How the NPC acts when they're calm.
   */
  calmTrait: string
    /**
   * @description How the NPC acts when they're stressed.
   */
  stressTrait: string
  /**
   * @decription A noticeable vocal pattern.
   */
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
  /**
   * @description In the style of Xanathar's Background Origins
   */
  backgroundOrigin: string
  birthplace: string
  siblingNumber: number
  childhoodMemories: string
  parentalLineage: string
  partnerGenderProbability(npc: NPC): GenderName
  family: string
  familyHome: string
  familyLifestyle: string
  familyUnit: string
  knewParents: boolean
    /**
   * @description In the style of PHB bonds.
   */
  bond: string
  /**
   * @description In the style of PHB ideals.
   */
  ideal: string
    /**
   * @description In the style of PHB flaws.
   */
  flaw?: string
  greeting?: string[]
  death?: {
    murderer: null | string
    burialConditions: string
    graveStandard: string
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
  exclusions?(town: Partial<Town>, npc: NPC): boolean | undefined
}

export interface NpcRelationship {
  targetNpcKey: string
  relation: string
  description: string | null
}
