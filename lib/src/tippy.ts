import { ConstructUtils } from '../constructs/_common'

/**
 * To be used when you want to wrap a tippy around
 * something i.e. you know what you're doing
 *
 * **Note the lack of a closing span.**
 */
export const createTippy = (readout: string) => {
  return `<span class="tip" title=${JSON.stringify(readout)}><<run setup.tippy("span.tip")>>`
}

/**
 * Assumes that the first argument was created
 * using the createTippy function.
 *
 * **Note the two closing spans to accommodate this.**
 */
export const createTippyWord = (tippy: string, word: string) => {
  return `${tippy}<span class="dotted">${word}</span></span>`
}

/**
 * The function that should be used most of the time.
 */
export const createTippyFull = (readout: string, word: string) => {
  return `<span class="tip dotted" title=${JSON.stringify(readout)}>${word}<<run setup.tippy("span.tip")>></span>`
}

export function createAutoTippy<C extends ConstructUtils> (construct: C, ...args: Parameters<C['create']>) {
  return function autoTippy (word: string) {
    return createTippyFull(construct.readout(construct.create(...args)), word)
  }
}
