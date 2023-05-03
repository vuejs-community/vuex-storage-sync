import { deepMerge } from './utils/deep-merge.ts';

type MutationPayload = {
  payload: unknown;
  type: string;
};


// eslint-disable-next-line typescript/no-unused-vars
type Store<T> = {
  commit: Function;
  replaceState: Function;
  state: State;
  subscribe: Function;
};

export const DEFAULT_MUTATION_KEY = 'VSS_MUTATION';
export const DEFAULT_SNAPSHOT_KEY = 'VSS_SNAPSHOT';
export const UNIQUE_ID = `${Date.now()}-${Math.random()}`;

export type CreatePluginParams = {
  modules: string[];
  mutationKey: string;
  mutations: string[];
  snapshotKey: string;
};

export type Message = {
  from: string;
  mutation: MutationPayload;
};

export type State = Record<string, unknown>;

const transformState = (oldState: State, modules: string[]): State => modules
  .reduce((newState, module) => ({ ...newState, [module]: oldState[module] }), {});

export default ({
  modules = [],
  mutationKey = DEFAULT_MUTATION_KEY,
  mutations = [],
  snapshotKey = DEFAULT_SNAPSHOT_KEY
}: CreatePluginParams) => (store: Store<State>) => {
  // Work only in browser
  if (typeof window === 'undefined') {
    return;
  }

  let isLocked = false;

  // Replace state from last snapshot
  const snapshot: State | null = JSON.parse(window.localStorage.getItem(snapshotKey));
  if (snapshot !== null) {
    store.replaceState(deepMerge(store.state, snapshot));
  }

  store.subscribe((mutation: MutationPayload, state: State) => {
    if (isLocked) {
      return;
    }
    if (!mutations.includes(mutation.type)) {
      return;
    }

    window.localStorage.setItem(mutationKey, JSON.stringify(mutation));
    window.localStorage.removeItem(mutationKey);

    window.localStorage.setItem(snapshotKey, JSON.stringify(transformState(state, modules)));
  });

  window.addEventListener('storage', (event: StorageEvent) => {
    if (isLocked) {
      return;
    }
    if (event.key !== mutationKey) {
      return;
    }
    if (event.newValue === null) {
      return;
    }

    const message: Message = JSON.parse(event.newValue);
    if (message.from === UNIQUE_ID) {
      return;
    }

    try {
      store.commit(message.mutation.type, message.mutation.payload);
    } catch (error) {
      throw new Error(error);
    } finally {
      isLocked = false;
    }
  });
};
