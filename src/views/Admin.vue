<template>
  <div class="animated fadeIn">
    <b-col sm="6" lg="6">
      <b-card class="shadow">
        <h3>Admin</h3>
        <p>Upload a new boardfarm configuration file here. This will insert all your
          stations, devices, etc into the database.
        </p>
        <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <div class="dropbox">
          <input type="file"
                 ref="file"
                 :name="uploadFieldName"
                 :disabled="isSaving"
                 v-on:change="handleFileUpload()"
                 accept="application/json"
                 class="input-file">
            <p v-if="isInitial">
              Drag boardfarm JSON file here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading file...
            </p>
        </div>
      </form>
      <h2 v-if="isSuccess">Successfully uploaded config! Visit dashboard page.</h2>
      <h2 v-if="isFail">Failed to upload config. Is it a valid boardfarm JSON file?</h2>
      </b-card>
    </b-col>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data: function () {
    return {
      file: "",
      isInitial: true,
      isSaving: false,
      isSuccess: false,
      isFail: false,
      uploadFieldName: 'json'
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        let json = JSON.parse(e.target.result)
        // this.$store.dispatch('uploadConfig', json)
        const promise = new Promise((resolve, reject) => {
          if (this.$store.dispatch('uploadConfig', json)) {
            resolve();
          } else {
            reject(Error('it broke'));
          }
        })
        promise.then(result => {
          this.isSuccess = true
        }, err => {
          this.isFail = true
          console.log(err);
        })
      }
      reader.readAsText(this.file)
    }
  }
}
</script>

<style lang="scss">
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>