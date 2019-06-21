<template>
  <b-row>
    <b-col cols="12" lg="6">
      <b-card no-header>
        <template slot="header">
          Station name:  {{ $route.params.id }}
        </template>
        <b-table striped small fixed responsive="sm" :items="items($route.params.id)" :fields="fields">
          <template slot="value" slot-scope="data">
            <strong>{{data.item.value}}</strong>
          </template>
        </b-table>
        <template slot="footer">
          <b-button @click="goBack">Back</b-button>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'
import usersData from './UsersData'

export default {
  name: 'User',
  computed: mapState([
    'stations'
  ]),
  components: {
    mapState
  },
  mounted () {
    this.$store.dispatch('loadStations')
  },
  props: {
    caption: {
      type: String,
      default: 'User id'
    },
  },
  data: () => {
    return {
      items: function(id) {
        const user = this.$store.state.stations.find( user => user.name.toString() === id)
        const userDetails = user ? Object.entries(user) : [['id', 'Not found']]
        return userDetails.map(([key, value]) => {return {key: key, value: value}})
      },
      fields: [
        {key: 'key'},
        {key: 'value'},
      ],
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      // this.$router.replace({path: '/users'})
    }
  }
}
</script>
