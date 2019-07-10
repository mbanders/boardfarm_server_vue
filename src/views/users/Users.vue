<template>
  <b-row>
    <b-col cols="12" xl="8">
      <transition name="slide">
      <b-card>
        <!-- <div slot="header" v-html="caption"></div> -->
        <b-table :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="stations" :fields="fields" :current-page="currentPage" :per-page="perPage" @row-clicked="rowClicked">
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
        {key: 'name'},
        {key: 'board_type'},
        {key: 'total_uses'},
        {key: 'location'},
        {key: 'active_user'},
        {key: 'prev_user'}
      ],
      currentPage: 1,
      perPage: 75,
      totalRows: 0
    }
  },
  computed: mapState([
    'stations'
  ]),
  methods: {
    getRowCount (items) {
      return items.length
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
