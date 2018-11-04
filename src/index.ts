import { MutationPayload, Store } from 'vuex';

export const DEFAULT_MUTATION_KEY = 'VSS_MUTATION';
export const DEFAULT_SNAPSHOT_KEY = 'VSS_SNAPSHOT';

export type CreatePluginParams = {
  mutationKey: string;
  snapshotKey: string;
};

export type State = Record<string, unknown>;

export default ({
  mutationKey = DEFAULT_MUTATION_KEY,
  snapshotKey = DEFAULT_SNAPSHOT_KEY
}: CreatePluginParams) => (store: Store<State>) => {
  // Work only in browser
  if (typeof window === 'undefined') {
    return;
  }

  // Replace state from last snapshot
  const snapshot: State | null = JSON.parse(window.localStorage.getItem(snapshotKey));
  if (snapshot !== null) {
    store.replaceState(snapshot);
  }

  store.subscribe((mutation: MutationPayload, state: State) => {
    try {
      window.localStorage.setItem(mutationKey, JSON.stringify(mutation));
      window.localStorage.removeItem(mutationKey);

      window.localStorage.setItem(snapshotKey, JSON.stringify(state));
    } catch (error) {
      throw new Error(error);
    }
  });

  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key !== mutationKey) {
      return;
    }
    if (event.newValue === null) {
      return;
    }

    try {
      const mutation: MutationPayload = JSON.parse(event.newValue);

      store.commit(mutation.type, mutation.payload);
    } catch (error) {
      throw new Error(error);
    }
  });
};
