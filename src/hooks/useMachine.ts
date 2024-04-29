import { useMachine as useMachineRaw } from '@xstate/react'
import { isEmpty, isEqual, omit } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import type { Actor, AnyStateMachine, EventFromLogic, StateFrom } from 'xstate'

export function useMachine<TMachine extends AnyStateMachine>(
  machine: TMachine,
): [StateFrom<TMachine>, Actor<TMachine>['send'], Actor<TMachine>] {
  const storageKey = useMemo(() => machine.config.id!, [machine.config.id])
  const persistedSnapshotUnparsed = sessionStorage.getItem(storageKey)
  const persistedSnapshot = useMemo(() => {
    const snapshot = JSON.parse(persistedSnapshotUnparsed ?? 'null')

    return { ...snapshot, children: {} } as StateFrom<TMachine>
  }, [persistedSnapshotUnparsed])

  const [snapshot, rawSend, actorRef] = useMachineRaw(machine, {
    ...(!isEmpty(omit(persistedSnapshot, 'children')) && {
      snapshot: { ...persistedSnapshot },
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
