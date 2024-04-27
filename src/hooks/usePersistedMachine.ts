import { useMachine } from '@xstate/react'
import { useCallback, useEffect } from 'react'
import type { Actor, AnyStateMachine, EventFromLogic, StateFrom } from 'xstate'

export function usePersistedMachine<TMachine extends AnyStateMachine>(
  storageKey: string,
  machine: TMachine,
): [StateFrom<TMachine>, Actor<TMachine>['send'], Actor<TMachine>] {
  const persistedState = sessionStorage.getItem(storageKey)

  const [snapshot, rawSend, actorRef] = useMachine(machine, {
    ...(persistedState && { snapshot: JSON.parse(persistedState) }),
  })

  useEffect(() => {
    // To jumpstart 'always' actions when restoring from persisted state
    rawSend({ type: 'jumpstart' } as EventFromLogic<TMachine>)
  }, [rawSend])

  const send = useCallback((event: EventFromLogic<TMachine>) => {
    rawSend(event)
    sessionStorage.setItem(
      storageKey,
      JSON.stringify(actorRef.getPersistedSnapshot()),
    )
  }, [actorRef, rawSend, storageKey])

  return [snapshot, send, actorRef]
}
