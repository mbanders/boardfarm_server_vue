import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export default new Vuex.Store({
  state: {
     stations: []
  },
  actions: {
    loadStations ({ commit }) {
        axios
          .get('http://boardfarm.bluejam.net/api/stations')
          .then(r => r.data)
          .then(stations => {
              commit('SET_STATIONS', stations)
          })
      }
  },
  mutations: {
    SET_STATIONS (state, stations) {
        state.stations = stations
      }
  }
})