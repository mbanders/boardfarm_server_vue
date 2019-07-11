import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const base_url = 'http://boardfarm.bluejam.net/api/'

export default new Vuex.Store({
  state: {
     stations: []
  },
  actions: {
    loadStations ({ commit }) {
        axios
          .get(base_url + 'stations')
          .then(r => r.data)
          .then(stations => {
              commit('SET_STATIONS', stations)
          })
      },
      disableStation (commit, {name, reason}) {
        var url = base_url + 'stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {
          available_for_autotests: false,
          note: reason
        }
        axios.post(url, data, headers)
      },
      enableStation (commit, name) {
        var url = base_url + 'stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {
          available_for_autotests: true,
          note: ''
        }
        axios.post(url, data, headers)
      }
  },
  mutations: {
    SET_STATIONS (state, stations) {
        state.stations = stations
      }
  }
})