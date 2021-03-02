import { isObj, isValid, clone, isFn } from '@formily/shared'
import { ProxyRaw, MakeObservableSymbol, Untracking } from './environment'
import { Annotation } from './types'

export const isObservable = (target: any) => {
  return ProxyRaw.has(target)
}

export const isAnnotation = (target: any): target is Annotation => {
  return !!target[MakeObservableSymbol]
}

export const isSupportObservable = (target: any) => {
  if (!isValid(target)) return false
  if (isObj(target)) {
    if ('$$typeof' in target && '_owner' in target) {
      return false
    }
    if (target['_isAMomentObject']) {
      return false
    }
    if (target['_isJSONSchemaObject']) {
      return false
    }
    if (isFn(target['toJS'])) {
      return false
    }
    if (isFn(target['toJSON'])) {
      return false
    }
  }
  return false
}

export const toJS = (target: any) => clone(target)

export const untracked = <T extends () => any>(callback?: T): ReturnType<T> => {
  Untracking.value = true
  let res: any
  if (isFn(callback)) {
    res = callback()
  }
  Untracking.value = false
  return res
}
