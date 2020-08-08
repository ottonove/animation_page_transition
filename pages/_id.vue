<template>
  <div ref="content" class="content">
    <h1>詳細</h1>
    <img :src=picList[this.id] ref="targetImage" width="80%">
    <p>
    月日は百代(はくだい)の過客（かかく）にして、行きかふ年もまた旅人なり。舟の上に生涯を浮かべ、
馬の口とらへて老を迎ある者は、日々旅にして、旅をすみかとす。古人も多く旅に死せるあり。
予もいづれの年よりか、片雲の風に誘はれて、漂白の思ひやまず、海浜にさすらへ、去年（こ
ぞ）の秋、江上の破屋（はおく）に蜘蛛の巣をはらひて、やや年も暮れ、春立てる霞の空に、
白河の関越えんと、そぞろ神の物につきて心を狂はせ、道祖神の招きにあひて、取るものも手
につかず。
ももひきの破れをつづり、笠の緒つけかへて、三里に灸（きゅう）すうるより、松島の月先づ心
にかかりて、住める方は人にゆづり、杉風（さんぷう）が別しょに移るに、
草の戸も住みかはる代ぞひなの家
面八句（おもてはっく）を庵の柱にかけておく。
    </p>
  </div>
</template>

<script>
import { getAbsolutePosition } from '~/plugins/getAbsolutePosition'

import anime from 'animejs/lib/anime.es.js'

export default {
  data() {
    return {
      id: this.$route.params.id,
      pass: this.$route.params.pass,
      picList: ["img01@2x.jpg", "img02@2x.jpg", "img03@2x.jpg", "img04@2x.jpg", "img05@2x.jpg"]
    }
  },
  
  beforeRouteEnter(to, from, next) {
    if(from.name === null) {
      next(vm => {
          //vm.styleObj.opacity = 1;
          console.log("this:",vm)
          anime({
            targets: vm.$refs.content,
            opacity: [0, 1],
            easing: 'easeInOutQuart',
            duration: 800,
            complete: ()=>{
              console.log("content show complete")
            }
          })
      });
    }
    else {
      // 遷移時にアニメーションを実行
      next(vm => vm.setImageData());
    }
  },
  
  beforeRouteLeave(to, from, next) {
    // クリックした記事の情報を取得
    const component = this.$refs.targetImage

    // 遷移前の画像の位置を取得
    const src = component.src;
    console.log("src:",src)

    const pos = getAbsolutePosition(component)
    console.log(pos)

    const styleObj = {
      top: `${pos.top}px`,
      left: `${pos.left}px`,
      width: `${component.clientWidth}px`,
    }

    // ダミー画像に位置と画像のURLを渡す
    this.$nuxt.$emit('layoutImage', {
      src: src,
      styleObj: styleObj
    });

    const scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;
    // ページを上部に移動
    anime({
      targets: scrollElement,
      scrollTop: 0,
      easing: 'easeInOutQuart',
      duration: 800,
      complete: () => {
        console.log("scrollTop complete")
      }
    });

    // ページの不透明度を0にアニメーション
    anime({
      targets: this.$refs.content,
      opacity: [1, 0],
      easing: 'easeInOutQuart',
      duration: 800,
      complete: ()=>{
        next()
      }
    });
  },

  methods: {
    setImageData() {
      const node = this.$refs.targetImage;
      // const wrapRect = this.$refs.content.getBoundingClientRect();
      const itemRect = getAbsolutePosition(node)
      console.log("itemRect",itemRect)
 
      // 遷移後の画像の位置を取得
      const styleObj = {
        top: `${itemRect.top/*  - wrapRect.top */}px`,
        left: `${itemRect.left/*  - wrapRect.left */}px`,
        width: `${node.clientWidth}px`
      }
 
      node.style.opacity = 0;
 
      // ダミー画像に情報を渡す
      Promise.resolve(
        this.$nuxt.$emit('layoutImageMove', {
          styleObj: styleObj,
          node: node
        })
      ).then(()=>{
        // ページの不透明度を1にする
        anime({
          targets: this.$refs.content,
          opacity: [0, 1],
          easing: 'easeInOutQuart',
          duration: 800,
          complete: ()=>{
            console.log("content show complete")
          }
        });
      })
    }
  }
}
</script>

<style>
.content{
  opacity: 0;
}
</style>