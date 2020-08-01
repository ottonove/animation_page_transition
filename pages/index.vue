<template>
  <v-layout
    column
    justify-center
    align-center
  >
      <v-col
        v-for="(pic, i) in picList"
        :key="i"
        class="my-16"
      >
        <img :src=pic ref="item" :id=i+1 />
      </v-col>

      <v-btn to="/inspire" class="my-16">inspire</v-btn>
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
    // クリックした記事の情報を取得
    const component = this.$refs.item.find((x) => {
        return x.id === String(2)/* to.params.id */
    });

    console.log("component:",component)
    let node = component;

    const itemRect = node.getBoundingClientRect();
    console.log("itemRect:",itemRect)

    // 遷移前の画像の位置を取得
    const src = component.src;
    console.log("src:",src)

    const styleObj = {
      top: `${itemRect.top/*  - listRect.top */}px`,
      left: `${itemRect.left/*  - listRect.left */}px`,
      width: `${node.clientWidth}px`
    }

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
      duration: 800,
      complete: () => {
        console.log("scrollTop complete")
      }
    });

    console.log("node:", node)
    
    // ページの不透明度を0にアニメーション
    anime({
      targets: node,//this.$refs.list,
      opacity: [1, 0],
      easing: 'easeInOutQuart',
      duration: 800,
      complete: () => {
        console.log("node.style.opacity:",node)
        next()
      }
    });
  }
}

</script>
