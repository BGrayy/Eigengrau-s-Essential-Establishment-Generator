export interface Town {
  name: string
  type: string
  population: number
  roll: {
    guardFunding: number
    wealth: number
    economics: number
    welfare: number
    military: number
    law: number
    sin: number
    arcana: number
  }
  wealth: string
  economics: string
  welfare: string
  military: string
  law: string
  sin: string
  arcana: string
  politicalIdeology: string
  hasBrothel: boolean
  guard: {
    funding: string
  }
}
