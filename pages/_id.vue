<template>
  <div>
    <h1>idとpassパラメータ取得</h1>
    <p>{{ id }}</p>
    <p>{{ pass }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      pass: this.$route.params.pass
    }
  }
}
</script>