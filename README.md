# vuex-storage-sync
Vuex plugin for sync state between browser tabs

## Installation

```bash
$ npm install vuex-storage-sync
```

## Usage

```js
import Vue from 'vue';
import Vuex from 'vuex';
import createStorageSync from 'vuex-storage-sync';

Vue.use(Vuex);

export function createStore () {
  return new Vuex.Store({
    actions: {},
    getters: {},
    mutations: {},
    state: {},
    plugins: [
      createStorageSync(),
      // or with params
      createStorageSync({
        mutationKey: 'MY_MUTATION_KEY',
        snapshotKey: 'MY_SNAPSHOT_KEY'
      })
    ]
  });
}
```

## License

MIT © [Ed Nikolenko](https://github.com/ednikolenko)