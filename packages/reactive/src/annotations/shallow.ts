import { createAnnotation, createObservable } from '../internals'
import { buildObservableTree } from '../traverse'
import {
  addDependencyForOperation,
  queueReactionsForOperation,
} from '../reaction'

export const shallow = createAnnotation(({ target, key, value }) => {
  const store = {
    value: createObservable({
      target,
      key,
      value,
      shallow: true,
    }),
  }

  buildObservableTree({
    target,
    key,
    value: store,
  })

  function get() {
    addDependencyForOperation({
      target: target,
      key: key,
      type: 'get',
    })
    return store.value
  }

  function set(value: any) {
    const oldValue = store.value
    value = createObservable({
      target: target,
      key: key,
      value,
      shallow: true,
    })
    store.value = value
    queueReactionsForOperation({
      target: target,
      key: key,
      type: 'set',
      oldValue,
      value,
    })
  }
  if (target) {
    Object.defineProperty(target, key, {
      set,
      get,
      enumerable: true,
      configurable: false,
    })
  }
  return store.value
})
