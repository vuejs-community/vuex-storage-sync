# @vuejs-community/vuex-storage-sync
Vuex plugin for sync state between browser tabs

## Installation

```bash
$ npm install @vuejs-community/vuex-storage-sync
```

## Usage

```js
import Vue from 'vue';
import Vuex from 'vuex';
import createStorageSync from '@vuejs-community/vuex-storage-sync';

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
        // Allowed to snapshoting modules
        modules: [],
        mutationKey: 'MY_MUTATION_KEY',
        // Allowed to synchronize mutations
        mutations: [],
        snapshotKey: 'MY_SNAPSHOT_KEY'
      })
    ]
  });
}
```

## License

MIT © [Vue.js Community](https://github.com/vuejs-community)
