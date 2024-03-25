import { useMachine } from '@xstate/react'
import { throttle } from 'lodash'
import { useEffect } from 'react'
import type { Actor, AnyStateMachine, EventFromLogic, StateFrom } from 'xstate'

export function usePersistedMachine<TMachine extends AnyStateMachine>(
  storageKey: string,
  machine: TMachine,
): [StateFrom<TMachine>, Actor<TMachine>['send'], Actor<TMachine>] {
  const persistedState = sessionStorage.getItem(storageKey)

  const [snapshot, send, actorRef] = useMachine(machine, {
    ...(persistedState && { snapshot: JSON.parse(persistedState) }),
  })

  useEffect(() => {
    // To execute actions when restoring from persisted state
    send({ type: 'jumpstart' } as EventFromLogic<TMachine>)
  }, [send])

  useEffect(() => {
    const persist = throttle(() => {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify(actorRef.getPersistedSnapshot()),
      )
    }, 500)
    const { unsubscribe } = actorRef.subscribe(persist)

    return () => {
      unsubscribe()
      persist.flush()
    }
  }, [actorRef, storageKey])

  return [snapshot, send, actorRef]
}
