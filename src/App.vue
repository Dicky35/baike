<template>
  <div id="app">
<!--    <myHeader/>-->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import myHeader from './components/myHeader.vue'

export default {
  name: 'app',
  components: {
    myHeader
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>

</style>
