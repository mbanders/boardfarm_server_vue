<template>
  <div class="animated fadeIn">
    <b-col sm="6" lg="6">
      <b-card class="shadow">
        <h3>About</h3>
        <p>Boardfarm server makes it easy to manage a large set of test stations. It presents a live view
          of the status of equipment, and facilitates the "checking out" of test equipment.
          The command-line <a href="https://github.com/lgirdk/boardfarm">boardfarm</a> test framework contacts
          this server to find available stations for use.
        </p>
      </b-card>
    </b-col>
  </div>
</template>

<script>

export default {
  name: 'about'
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
</style>
