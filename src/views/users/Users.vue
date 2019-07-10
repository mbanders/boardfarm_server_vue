<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12" xl="8">
        <transition name="slide">
        <b-card>
          <!-- Search bar -->
          <b-form-group cols="6" xl="6" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <!-- <div slot="header" v-html="caption"></div> -->
          <b-table :hover="hover" :striped="striped" :filter="filter"
                   :bordered="bordered" :small="small"
                   :fixed="fixed" responsive="sm"
                   :items="stations" :fields="fields"
                   :current-page="currentPage" :per-page="perPage"
                   @row-clicked="rowClicked">
            <template slot="id" slot-scope="data">
              <strong>{{data.item.id}}</strong>
            </template>
            <template slot="name" slot-scope="data">
              <strong>{{data.item.name}}</strong>
            </template>
            <template slot="active_user" slot-scope="data">
              <span v-if="data.item.active_user != ''">{{ data.item.active_user }}@{{ data.item.active_host }}</span>
            </template>
            <template slot="prev_user" slot-scope="data">
              <span v-if="data.item.prev_user != ''">{{ data.item.prev_user }}@{{ data.item.prev_host }}</span>
            </template>
          </b-table>
          <nav>
            <b-pagination size="sm" :total-rows="getRowCount(stations)" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
          </nav>
        </b-card>
        </transition>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Users',
  props: {
    caption: {
      type: String,
      default: 'Stations'
    },
    hover: {
      type: Boolean,
      default: true
    },
    striped: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      fields: [
        {key: 'name', sortable: true},
        {key: 'board_type', sortable: true},
        {key: 'total_uses', sortable: true},
        {key: 'location', sortable: true},
        {key: 'active_user', sortable: true},
        {key: 'prev_user', sortable: true}
      ],
      filter: null,
      currentPage: 1,
      perPage: 15,
      totalRows: 0
    }
  },
  computed: mapState([
    'stations'
  ]),
  methods: {
    getRowCount (items) {
      return this.stations.length
    },
    userLink (id) {
      return `stations/${id.toString()}`
    },
    rowClicked (item) {
      const userLink = this.userLink(item.name)
      this.$router.push({path: userLink})
    }

  }
}
</script>

<style scoped>
.card-body >>> table > tbody > tr > td {
  cursor: pointer;
}
</style>
