<template>
  <v-layout
    column
    justify-center
    align-center
  >
      <v-col
        v-for="(pic, i) in picList"
        :key="i"
      >
        <img :src=pic ref="item" :id=i+1 />
      </v-col>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

import anime from 'animejs/lib/anime.es.js'


export default {
  data () {
    return {
      picList: ["img01@2x.jpg","img02@2x.jpg"]
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  beforeRouteLeave(to, from, next) {
    console.log(this.$refs)
    // クリックした記事の情報を取得
    const component = this.$refs.item.find((x) => {
      console.log("x:",x)
      //return x.item.id === parseInt(to.params.id);
    });

    const node = component.$refs.img;

    const listRect = this.$refs.list.getBoundingClientRect();
    const itemRect = node.getBoundingClientRect();

    // 遷移前の画像の位置を取得
    const src = this.base + component.item.src;
    const styleObj = {
      top: `${itemRect.top - listRect.top}px`,
      left: `${itemRect.left - listRect.left}px`,
      width: `${node.clientWidth}px`
    }

    node.style.opacity = 0;

    // ダミー画像に位置と画像のURLを渡す
    this.$nuxt.$emit('layoutImage', {
      src: src,
      styleObj: styleObj
    });

    // ページを上部に移動
    anime({
      targets: '#__nuxt',
      scrollTop: 0,
      easing: 'easeInOutQuart',
      duration: 800
    });

    // ページの不透明度を0にアニメーション
    anime({
      targets: this.$refs.list,
      opacity: [1, 0],
      easing: 'easeInOutQuart',
      duration: 800,
      complete: () => next()
    });
  }
}

</script>
