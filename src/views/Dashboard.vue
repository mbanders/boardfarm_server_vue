<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6" lg="3" v-for="station in stations" v-bind:key="station.name">
        <b-card no-body :class="bgColor(station)">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item v-if="station.available_for_autotests==true" v-on:click="disableStation(station.name)">Disable Station</b-dropdown-item>
              <b-dropdown-item v-else v-on:click="enableStation(station.name)">Enable Station</b-dropdown-item>
            </b-dropdown>
            <a v-bind:href="'#/users/'+station.name" style='color: inherit;text-decoration: inherit;'>
              <h3 class="mb-0">{{ station.name }}
                <span v-if="station.active_users>0"> (in use)</span>
                <span v-if="station.available_for_autotests==false"> (disabled)</span>
              </h3>
            </a>
            <p>Type: {{ station.board_type }}<br>
               Location: {{station.location}}<br>
               Features: <span v-for="(x, index) in station.feature" v-bind:key="x">
                   <span>{{x}}</span><span v-if="index+1 < station.feature.length">, </span>
                </span><br>
                Last Use: <span v-if="station.prev_user.length>0">{{ station.prev_user}}@{{ station.prev_host}}</span>
            </p>
          </b-card-body>
          <!-- <card-line1-chart-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;" :height="70"/> -->
          <div class="brand-card-body">
            <div>
              <div class="text-value small" v-if="station.active_users != 0">{{ station.active_user }}<br>@{{ station.active_host }}</div>
              <div class="text-value small" v-else><br><br></div>
              <div class="text-uppercase small">Active User</div>
            </div>
            <div>
              <div class="text-value"><br>{{ Number(station.total_uses).toLocaleString() }}</div>
              <div class="text-uppercase small">Total Uses</div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
import CardBarChartExample from './dashboard/CardBarChartExample'
import MainChartExample from './dashboard/MainChartExample'
import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
import CalloutChartExample from './dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'

export default {
  name: 'dashboard',
  data: function () {
    return {
      selected: 'Month'
    }
  },
  mounted () {
    this.$store.dispatch('loadStations')

    this.interval = setInterval(function () {
      this.$store.dispatch('loadStations')
    }.bind(this), 4000)
  },
  computed: mapState([
    'stations'
  ]),
  components: {
    mapState,
    Callout,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  methods: {
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    },
    disableStation (name) {
      this.$store.dispatch('disableStation', name)
    },
    enableStation (name) {
      this.$store.dispatch('enableStation', name)
    },
    bgColor (station) {
      if (station.available_for_autotests == false) {
        return 'bg-secondary'
      }
      if (station.active_users >= 1) {
        return 'bg-warning'
      }
      return 'bg-primary'
    },
    flag (value) {
      return 'flag-icon flag-icon-' + value
    }
  }
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
</style>
