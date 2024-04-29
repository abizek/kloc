import { useMachine as useMachineRaw } from '@xstate/react'
import { isEqual, omit } from 'lodash'
import { useCallback, useEffect } from 'react'
import type { Actor, AnyStateMachine, EventFromLogic, StateFrom } from 'xstate'

export function useMachine<TMachine extends AnyStateMachine>(
  storageKey: string,
  machine: TMachine,
): [StateFrom<TMachine>, Actor<TMachine>['send'], Actor<TMachine>] {
  const persistedSnapshot = JSON.parse(
    sessionStorage.getItem(storageKey) ?? 'null',
  )

  const [snapshot, rawSend, actorRef] = useMachineRaw(machine, {
    ...(persistedSnapshot && {
      snapshot: {
        ...persistedSnapshot,
        children: {},
      },
    }),
  })

  useEffect(() => {
    // To jumpstart 'always' actions when restoring from persisted state
    rawSend({ type: 'jumpstart' } as EventFromLogic<TMachine>)
  }, [rawSend])

  useEffect(() => {
    if (
      persistedSnapshot &&
      !isEqual(snapshot.value, persistedSnapshot.value)
    ) {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify(
          omit(actorRef.getPersistedSnapshot(), ['children', 'historyValue']),
        ),
      )
    }
  }, [actorRef, persistedSnapshot, snapshot.value, storageKey])

  const send = useCallback(
    (event: EventFromLogic<TMachine>) => {
      rawSend(event)
      sessionStorage.setItem(
        storageKey,
        JSON.stringify(actorRef.getPersistedSnapshot()),
      )
    },
    [actorRef, rawSend, storageKey],
  )

  return [snapshot, send, actorRef]
}
