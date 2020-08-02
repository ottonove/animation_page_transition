<template>
  <div ref="detail" class="detail">
    <h1>idとpassパラメータ取得</h1>
    <p>{{ id }}</p>
    <p>{{ pass }}</p>
    <img :src=picList[this.id] ref="img" width="800">
  </div>
</template>

<script>
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
            targets: vm.$refs.detail,
            opacity: [0, 1],
            easing: 'easeInOutQuart',
            duration: 800,
            complete: ()=>{
              console.log("detail show complete")
            }
          })
      });
    }
    else {
      // 遷移時にアニメーションを実行
      next(vm => vm.setImageData());
    }
  },
  methods: {
    getAbsolutePosition(elm,appbarHeight){
      const {left, top} = elm.getBoundingClientRect();
      const {left: bleft, top: btop} = document.body.getBoundingClientRect();
      return {
        left: left - bleft,
        top: top - btop - appbarHeight // appbarのheightを引く,
      }
    },
    setImageData() {
      const node = this.$refs.img;
      // const wrapRect = this.$refs.detail.getBoundingClientRect();
      const itemRect = this.getAbsolutePosition(node,64)
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
          targets: this.$refs.detail,
          opacity: [0, 1],
          easing: 'easeInOutQuart',
          duration: 800,
          complete: ()=>{
            console.log("detail show complete")
          }
        });
      })
    }
  }
}
</script>

<style>
.detail{
  opacity: 0;
}
</style>