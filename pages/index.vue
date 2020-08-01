<template>
  <v-layout
    column
    justify-center
    align-center
    ref="box"
  >
      <v-col
        v-for="(pic, i) in picList"
        :key="i"
        class="my-16"
      >
        <img :src=pic ref="item" :id=i+1 @click="next(i)" />
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
      picList: ["img01@2x.jpg","img02@2x.jpg"],
      picId: null
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  methods:{
    next: function(id){
      this.picId = id
      this.$router.push("/"+id)
    }
  },
  beforeRouteLeave(to, from, next) {
    // クリックした記事の情報を取得
    const component = this.$refs.item.find((x) => {
        return x.id === String(this.picId)/* to.params.id */
    });

    console.log("component:",component)
    let node = component;

    const itemRect = node.getBoundingClientRect();
    console.log("itemRect:",itemRect)

    // 遷移前の画像の位置を取得
    const src = component.src;
    console.log("src:",src)

    const boxRect = this.$refs.box.getBoundingClientRect()
    console.log("boxRect:",boxRect)

    const styleObj = {
      top: `${itemRect.top - boxRect.top}px`,
      left: `${itemRect.left - boxRect.left}px`,
      width: `${node.clientWidth}px`,
      //opacity: 0
    }

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
      targets: this.$refs.box,//this.$refs.list,
      opacity: [1, 0],
      easing: 'easeInOutQuart',
      duration: 800,
      complete: ()=>{
        // ダミー画像に位置と画像のURLを渡す
        this.$nuxt.$emit('layoutImage', {
          src: src,
          styleObj: styleObj
        });
        next()
      }
    });
  }
}

</script>
