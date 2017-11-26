const DEFAULT_MUTATION_KEY = 'VSS_MUTATION';
const DEFAULT_SNAPSHOT_KEY = 'VSS_SNAPSHOT';

export default ({ mutationKey = DEFAULT_MUTATION_KEY, snapshotKey = DEFAULT_SNAPSHOT_KEY }) => store => {
  // Work only in browser
  if (typeof window === 'undefined') {
    return;
  }

  // Replace state from last snapshot
  const snapshot = JSON.parse(window.localStorage.getItem(snapshotKey));
  if (snapshot !== null) {
    store.replaceState(snapshot);
  }

  store.subscribe((mutation, state) => {
    try {
      window.localStorage.setItem(mutationKey, JSON.stringify(mutation));
      window.localStorage.removeItem(mutationKey);

      window.localStorage.setItem(snapshotKey, JSON.stringify(state));
    } catch (error) {
      throw new Error(error);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== mutationKey) {
      return;
    }
    if (event.newValue === null) {
      return;
    }

    try {
      const mutation = JSON.parse(event.newValue);

      store.commit(mutation.type, mutation.payload);
    } catch (error) {
      throw new Error(error);
    }
  });
};
