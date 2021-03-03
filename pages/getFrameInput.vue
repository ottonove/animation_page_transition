<template>
<v-app>
<div id="contents">
  <!-- ファイルはstaticディレクトリに配置する-->
  <!-- <video
    src="/sample.mp4"
    width="600"
    height="300"
    controls
  >
  </video> -->
  <video></video>
  <input type="file" @change="handleInput" />
  <input type="number" class="p2p_scl" @change="handleChange" />
  <v-btn @click="handleClick(frameTime)">getFrame</v-btn>
  <img :src=base64Image />
</div>
</v-app>
</template>

<script>
const readChunk = (file) => (chunkSize, offset) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target.error) {
          reject(event.target.error)
        }
        resolve(new Uint8Array(event.target.result))
      }
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
    })

export default {
  head() {
    return {
      script: [
        { src: 'https://unpkg.com/mediainfo.js/dist/mediainfo.min.js', async: true, defer: true }
      ]
    }
  },
  
  data: function () {
    return({
      frameTime: 0,
      base64Image: "/v.png",
      videoInfo: null
    })
  },

  mounted() {
    
  },

  methods: {

    handleChange: function(e) {
      console.log(e.target.value);
      this.frameTime = e.target.value;
    },

    handleClick: async function(frameTime) {
      console.log(frameTime);
      const base64Image = await this.getFrame(frameTime);
      console.log('getFrame:\n', base64Image);
      this.base64Image = base64Image;
    },

    handleInput: async function(event) {
      const file = event.target.files[0];
      const videoElement = document.querySelector("video");
      // const videoElement = document.createElement('video');

      // const fileName = mp4File;// 'sample_er.mp4';
      // const fileRef = await storage.ref(`uploads/user/${auth.currentUser.uid}/${fileName}`);
      // const url = await fileRef.getDownloadURL();
      // const response = await fetch(url);
      // const arrayBuffer = await response.arrayBuffer();
      // const blob = new Blob([arrayBuffer], {type:"video/mp4"});

      const mediainfo = await MediaInfo();
      const analyzeResult = await mediainfo.analyzeData(() => file.size, readChunk(file));
      if(analyzeResult.media.track[1] === undefined) {
        console.log('not video file');
        return ;
      }
      if(analyzeResult.media.track[1]['@type'] !== 'Video') {
        console.log('not video file');
        return ;
      }
      console.log(analyzeResult.media.track[1]);
      this.videoInfo = analyzeResult.media.track[1];

      videoElement.width = this.videoInfo.Width * 0.5;
      videoElement.height = this.videoInfo.Height * 0.5;
      // videoElement.src = window.URL.createObjectURL(blob);
      videoElement.src = window.URL.createObjectURL(event.target.files[0]);
      // this.videoElement = videoElement;
    },

    getFrame: async function(frameTime) {
      const videoElement = document.querySelector("video");
      // videoElement.src = window.URL.createObjectURL(document.getElementById('fileinput').files[0]);
      
      let base64Image = "";
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.width;
      canvas.height = videoElement.height;
      const context = canvas.getContext('2d');

      // 1つ前に設定したframeTimeの画像がbase64Imageとして生成される
      // videoElement.currentTime = frameTime;
      // console.log('videoElement.currentTime:', videoElement.currentTime);
      // /* await */ context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      // base64Image = /* await */ canvas.toDataURL();

      // これを正しくさせたい
      const videoSeek = () => {
        return new Promise((resolve) => {
          videoElement.addEventListener('seeked', (e) => {
              console.log('videoElement.currentTime:', videoElement.currentTime);
              // console.log("frameTime:", frameTime);
              // console.log('getFrame drawImage 0:', base64Image);
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
              base64Image = canvas.toDataURL();
              // console.log('getFrame drawImage:', this.base64Image);
              resolve();
          }, {once: true});
          videoElement.currentTime = frameTime;
        })
      };
      await videoSeek();

      
      // videoElement.addEventListener('seeked', (e) => {
      //     console.log('videoElement.currentTime:', videoElement.currentTime);
      //     // console.log("frameTime:", frameTime);
      //     // console.log('getFrame drawImage 0:', base64Image);
      //     context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      //     base64Image = canvas.toDataURL(); // dataにthis.base64Imageを作成し、それに代入すれば動作はする。
      //     // console.log('getFrame drawImage:', this.base64Image);
      //     // resolve();
      // }, {once: true});
      // videoElement.currentTime = frameTime;
      // // console.log('getFrame drawImage2:', base64Image);
     

      return base64Image;
    }
  }
};
</script>

<style>
  input.p2p_scl{ width:60px; border:1px solid #888}
</style>
