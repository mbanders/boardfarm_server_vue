<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="1" lg="1" style="min-width:120px">
        <h2>Stations</h2>
      </b-col>
      <b-col sm="6" lg="3">
        <b-form-group cols="6" xl="6" >
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="6" lg="3">
        <p class="small"><br>{{ filteredStations.length }} of {{ stations.length }} stations.</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6" lg="3" v-for="station in filteredStations" v-bind:key="station.name">
        <b-card no-body :class="'shadow '+bgColor(station)">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item v-on:click="clickStation(station.name)">Details...</b-dropdown-item>
              <b-dropdown-item v-if="station._meta.available_for_autotests==true" v-on:click="getDisableReason(station.name)">Disable Station</b-dropdown-item>
              <b-dropdown-item v-else v-on:click="enableStation(station.name)">Enable Station</b-dropdown-item>
              <b-dropdown-item v-on:click="clearModal=true;selectedStationName=station.name">Check-in Station</b-dropdown-item>
            </b-dropdown>
            <router-link v-bind:to="'/stations/'+station.name" class="nocolor">
              <h3 class="mb-0">{{ station.name }}
                <span v-if="station.active_users>0"> (in use)</span>
                <span v-if="station._meta.available_for_autotests==false"> (disabled)</span>
              </h3>
            </router-link>
            <p><span v-if="station._meta.note !== ''"><b>Note: {{ station._meta.note }}</b><br></span>
               Type: {{ station.board_type }}<br>
               Location: {{station.location}}<br>
               Features: <span v-for="(x, index) in station.feature" v-bind:key="x">
                   <span>{{x}}</span><span v-if="index+1 < station.feature.length">, </span>
                </span><br>
                Last User: <span v-if="station.prev_user.length>0">
                            <span v-if="station.prev_url"><a v-bind:href="station.prev_url" class="nocolor">{{ station.prev_user}}@{{ station.prev_host}}</a></span>
                            <span v-else>{{ station.prev_user}}@{{ station.prev_host}}</span>
                          </span>
            </p>
          </b-card-body>
          <!-- <card-line1-chart-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;" :height="70"/> -->
          <div class="brand-card-body">
            <div style="flex: 3 1 auto">
              <div class="text-value small" v-if="station.active_users != 0">
                <span v-if="station.active_url">
                  <a v-bind:href="station.active_url" class="nocolor">{{ station.active_user }}<wbr>@{{ station.active_host }}</a>
                </span>
                <span v-else>{{ station.active_user }}<wbr>@{{ station.active_host }}</span>
                <br>
                for {{ timePassed(station.active_timestart) }}
                <span v-if="station._meta != undefined"><br>{{ station._meta.active_msg }}</span>
              </div>
              <div class="text-value small" v-else><br><br></div>
              <div class="text-uppercase small">Active User</div>
            </div>
            <div style="flex: 1 1 auto">
              <div class="text-value"><br>{{ Number(station._meta.total_uses) }}</div>
              <div class="text-uppercase small">Total Uses</div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col sm="1" lg="1" style="min-width:120px">
        <h2>Devices</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6" lg="3" v-for="dev in devices" v-bind:key="dev._id">
        <b-card no-body :class="'shadow '+bgColorDevices(dev)">
          <b-card-body class="pb-0">
              <h3 class="mb-0">{{ dev.name }}
                <span v-if="dev.active_users>0"> (in use)</span>
              </h3>
            <p>Type: {{ dev.type }}<br>
               Location: {{dev.location}}<br>
               IP Address: {{dev.ipaddr}}
            </p>
          </b-card-body>
          <div class="brand-card-body">
            <div style="flex: 3 1 auto">
              <div class="text-value small" v-if="dev.active_users != 0">
                <span>{{ dev.active_user }}<wbr>@{{ dev.active_host }}</span>
              </div>
              <div class="text-value small" v-else><br></div>
              <div class="text-uppercase small">Active User</div>
            </div>
            <div style="flex: 1 1 auto">
              <div class="text-value" v-if="dev._meta != undefined">{{ Number(dev._meta.total_uses) }}</div>
              <div class="text-value small" v-else><br></div>
              <div class="text-uppercase small">Total Uses</div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Modals (Popups) -->
    <b-modal :title="'Disable station '+selectedStationName"
             header-bg-variant="danger"
             v-model="dangerModal"
             @ok="disableStation(selectedStationName, selectedStationReason)"
             ok-variant="danger"
             :ok-disabled="selectedStationReason === null"
             ok-title="Disable">
      <b-form-group>
        <b-form-input v-model="selectedStationReason"
                      type="text"
                      id="reason"
                      placeholder="Reason for disabling ...">
        </b-form-input>
      </b-form-group>
    </b-modal>

    <b-modal :title="'Check-in station '+selectedStationName"
             header-bg-variant="danger"
             v-model="clearModal"
             @ok="clearStation(selectedStationName)"
             ok-variant="danger"
             ok-title="Check In">
        <p>This does not kick a user from a board. This only changes the database so
          that the active user field is empty. Useful if a job failed to check-in a
          station for some reason.
        </p>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'dashboard',
  data: function () {
    return {
      filter: '',
      dangerModal: false,
      clearModal: false,
      selectedStationName: null,
      selectedStationReason: null
    }
  },
  mounted () {
    this.$store.dispatch('loadDevices')
    this.$store.dispatch('loadStations')

    this.interval = setInterval(function () {
      this.$store.dispatch('loadDevices')
      this.$store.dispatch('loadStations')
    }.bind(this), 5000)
  },
  computed: {
    filteredStations: function() {
      if (this.filter == '') {
        return this.stations
      }
      return this.stations.filter((x) => {
        return x.name.includes(this.filter) ||
               x.location.includes(this.filter) ||
               x.feature.join(" ").includes(this.filter) ||
               x.active_user.includes(this.filter) ||
               x.active_host.includes(this.filter)
      })
    },
    ...mapState(['stations','devices']),
  },
  components: {
    mapState
  },
  methods: {
    timePassed (start_time) {
      start_time = Date.parse(start_time)
      var now = new Date()
      var delta = Math.abs(now - start_time) / 1000
      var hours_passed = Math.floor(delta / 3600)
      delta -= hours_passed * 3600
      var minutes_passed = Math.floor(delta / 60) % 60
      if (hours_passed < 1) {
        return minutes_passed.toString() + " min"
      } else {
        return hours_passed.toString() + "h " + minutes_passed.toString() + "m"
      }
    },
    clearStation (name) {
      this.clearModal = false
      this.$store.dispatch('clearStation', name)
    },
    clickStation (name) {
      this.$router.push({path: "stations/" + name})
    },
    getDisableReason (name) {
      this.selectedStationReason = null
      this.dangerModal = true
      this.selectedStationName = name
    },
    disableStation (name, reason) {
      this.dangerModal = false
      this.$store.dispatch('disableStation', {name, reason})
    },
    enableStation (name) {
      this.$store.dispatch('enableStation', name)
    },
    bgColorDevices (device) {
      if (device.active_users >= 1) {
        return 'bg-warning'
      }
      return 'bg-primary'
    },
    bgColor (station) {
      if (station._meta.available_for_autotests == false) {
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
  .nocolor {
    color: inherit;
    text-decoration: inherit;
  }
</style>
