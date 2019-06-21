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
      },
      disableStation (commit, name) {
        var url = 'http://boardfarm.bluejam.net/api/stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {available_for_autotests: false}
        axios.post(url, data, headers)
      },
      enableStation (commit, name) {
        var url = 'http://boardfarm.bluejam.net/api/stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {available_for_autotests: true}
        axios.post(url, data, headers)
      }
  },
  mutations: {
    SET_STATIONS (state, stations) {
        state.stations = stations
      }
  }
})