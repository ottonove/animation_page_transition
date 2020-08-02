<template>
  <div>
    <h1>idとpassパラメータ取得</h1>
    <p>{{ id }}</p>
    <p>{{ pass }}</p>
    <img src="img01@2x.jpg" ref="img">
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'

export default {
  data() {
    return {
      id: this.$route.params.id,
      pass: this.$route.params.pass
    }
  },
  beforeRouteEnter(to, from, next) {
    if(from.name === null) {
      next(vm => {
          vm.styleObj.opacity = 1;
      });
    }
    else {
      // 遷移時にアニメーションを実行
      next(vm => vm.setImageData());
    }
  },
  methods: {
    setImageData() {
      const node = this.$refs.img;
      // const wrapRect = this.$refs.detail.getBoundingClientRect();
      const itemRect = node.getBoundingClientRect();
 
      // 遷移後の画像の位置を取得
      const styleObj = {
        top: `${itemRect.top/*  - wrapRect.top */}px`,
        left: `${itemRect.left/*  - wrapRect.left */}px`,
        width: `${node.clientWidth}px`
      }
 
      node.style.opacity = 0;
 
      // ダミー画像に情報を渡す
      this.$nuxt.$emit('layoutImageMove', {
        styleObj: styleObj,
        node: node
      });
 
      // ページの不透明度を1にする
      anime({
        targets: this.styleObj,
        opacity: [0, 1],
        easing: 'easeInOutQuart',
        duration: 800
      });
    }
  }
}
</script>