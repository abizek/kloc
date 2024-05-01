import { isEmpty, isEqual, omit } from 'lodash'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { createActor } from 'xstate'
import type {
  Actor,
  AnyStateMachine,
  EventFromLogic,
  StateFrom,
  ActorOptions,
} from 'xstate'

export function useMachine<TMachine extends AnyStateMachine>(
  machine: TMachine,
): [StateFrom<TMachine>, Actor<TMachine>['send'], Actor<TMachine>] {
  const machineId = useMemo(() => machine.config.id!, [machine.config.id])

  const persistedSnapshotUnparsed = sessionStorage.getItem(machineId)
  const persistedSnapshot = useMemo(() => {
    const snapshot = JSON.parse(persistedSnapshotUnparsed ?? 'null')

    return { ...snapshot, children: {} } as StateFrom<TMachine>
  }, [persistedSnapshotUnparsed])

  const persist = useCallback(
    (value: object) => {
      sessionStorage.setItem(
        machineId,
        JSON.stringify(omit(value, ['children', 'historyValue'])),
      )
    },
    [machineId],
  )

  const [actorRef, setActorRef] = useState(() => {
    const isSnapshotPersisted = !isEmpty(omit(persistedSnapshot, 'children'))
    const actorRef = createActor(machine, {
      ...(isSnapshotPersisted && {
        snapshot: { ...persistedSnapshot },
      }),
    } as ActorOptions<TMachine>)

    if (!isSnapshotPersisted) {
      persist(actorRef.getPersistedSnapshot())
    }

    return actorRef
  })

  useEffect(() => {
    const listener = (event: CustomEvent) => {
      persist(event.detail)
      setActorRef(
        createActor(machine, {
          ...(!isEmpty(event.detail) && {
            snapshot: { ...event.detail },
          }),
        } as ActorOptions<TMachine>),
      )
    }
    window.addEventListener(`${machineId}-update`, listener as EventListener)

    return () => {
      window.removeEventListener(
        `${machineId}-update`,
        listener as EventListener,
      )
    }
  }, [machine, persist, machineId])

  useEffect(() => {
    actorRef.start()

    return () => {
      const snapshot = actorRef.getSnapshot()
      actorRef.stop()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(actorRef as any)._snapshot = snapshot
    }
  }, [actorRef])

  const getSnapshot = useCallback(
    () => actorRef.getSnapshot() as StateFrom<TMachine>,
    [actorRef],
  )

  const subscribe = useCallback(
    (onChange: () => void) => {
      const { unsubscribe } = actorRef.subscribe(onChange)
      return unsubscribe
    },
    [actorRef],
  )

  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  const rawSend = actorRef.send

  useEffect(() => {
    // To jumpstart 'always' actions when restoring from persisted state
    rawSend({ type: 'jumpstart' } as EventFromLogic<TMachine>)
  }, [rawSend])

  useEffect(() => {
    if (!isEqual(snapshot.value, persistedSnapshot.value)) {
      persist(actorRef.getPersistedSnapshot())
    }
  }, [actorRef, persist, persistedSnapshot.value, snapshot.value])

  const send = useCallback(
    (event: EventFromLogic<TMachine>) => {
      rawSend(event)
      persist(actorRef.getPersistedSnapshot())
    },
    [actorRef, persist, rawSend],
  )

  return [snapshot, send, actorRef]
}
