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
        <img :src=pic ref="item" :id=i @click="next(i)" width="300" />
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
    },
    getAbsolutePosition(elm,appberHeight){
      const {left, top} = elm.getBoundingClientRect();
      const {left: bleft, top: btop} = document.body.getBoundingClientRect();
      return {
        left: left - bleft,
        top: top - btop - appberHeight // appbarのheightを引く,
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // クリックした記事の情報を取得
    const component = this.$refs.item.find((x) => {
        return x.id === String(this.picId)/* to.params.id */
    });

    /* console.log("component:",component)
    let node = component; */

    // 遷移前の画像の位置を取得
    const src = component.src;
    console.log("src:",src)

    const pos = this.getAbsolutePosition(component,64) // 64 = appbarHeight
    console.log(pos)

    /* const boxRect = this.$refs.box.getBoundingClientRect()
    console.log("boxRect:",boxRect) */

    const styleObj = {
      top: `${pos.top/*  - boxRect.top */}px`,
      left: `${pos.left/*  - boxRect.left */}px`,
      width: `${component.clientWidth}px`,
      //opacity: 0
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

    // ページの不透明度を0にアニメーション
    anime({
      targets: this.$refs.box,//this.$refs.list,
      opacity: [1, 0],
      easing: 'easeInOutQuart',
      duration: 800,
      complete: ()=>{
        next()
      }
    });
  }
}

</script>
