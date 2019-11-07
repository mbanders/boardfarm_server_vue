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
      clearStation (commit, name) {
        var url = base_url + 'stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {
          active_user: '',
          active_host: '',
          active_users: 0
        }
        axios.post(url, data, headers)
      },
      disableStation (commit, {name, reason}) {
        var url = base_url + 'stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {
          '_meta.available_for_autotests': false,
          '_meta.note': reason
        }
        axios.post(url, data, headers)
      },
      enableStation (commit, name) {
        var url = base_url + 'stations/' + name
        var headers = {'Content-Type': 'application/json'}
        const data = {
          '_meta.available_for_autotests': true,
          '_meta.note': ''
        }
        axios.post(url, data, headers)
      },
      uploadConfig (commit, data) {
        var url = base_url + 'bf_config'
        var headers = {'Content-Type': 'application/json'}
        axios.post(url, data, headers)
          .then( (response) => {
          })
          .catch(error => error)
      }
  },
  mutations: {
    SET_STATIONS (state, stations) {
        state.stations = stations
      }
  }
})