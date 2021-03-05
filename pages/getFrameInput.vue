<template>
<v-app>
<div id="contents">
  <div class="space">
    <v-btn @click="fetchAPI">fetch api</v-btn>
  </div>
  <hr />
  <table>
    <tr>
      <th
        width="400"
      >
        動画
      </th>
      <th
        width="400"
      >
        静止画
      </th>
    </tr>
    <tr>
      <td>
        <video
          controls
        ></video>
      </td>
      <td>
        <img :src=base64Image />
      </td>
    </tr>
  </table>
  
  <div class="space">
    <input type="file" @change="handleInput" />
  </div>
  <div class="space">
    再生位置(秒)<input type="number" class="p2p_scl" @change="handleChange" />
  </div>
  <div class="space">
    <v-btn color="primary" @click="handleClick(frameTime)">getFrame</v-btn>
  </div>
</div>
</v-app>
</template>

<script>
import axios from 'axios';

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
      base64Image: "",
      videoInfo: null
    })
  },

  mounted() {
    
  },

  methods: {
    fetchAPI: async function() {
      const result = await axios("https://www.jma.go.jp/bosai/forecast/data/overview_forecast/240000.json");
      console.log(result);
    },

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

      const ratio = 0.2;
      videoElement.width = this.videoInfo.Width * ratio;
      videoElement.height = this.videoInfo.Height * ratio;
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
      videoElement.currentTime = frameTime;
      // console.log('videoElement.currentTime:', videoElement.currentTime);
      /* await */ context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      base64Image = /* await */ canvas.toDataURL();

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

      // これを正しくさせたい
      // const videoSeek = () => {
      //   return new Promise((resolve) => {
      //     videoElement.addEventListener('seeked', (e) => {
      //         console.log('videoElement.currentTime:', videoElement.currentTime);
      //         // console.log("frameTime:", frameTime);
      //         // console.log('getFrame drawImage 0:', base64Image);
      //         context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      //         base64Image = canvas.toDataURL();
      //         // console.log('getFrame drawImage:', this.base64Image);
      //         resolve();
      //     }, {once: true});
      //     videoElement.currentTime = frameTime;
      //   })
      // };
      // await videoSeek();

      return base64Image;
    }
  }
};
</script>

<style>
  input.p2p_scl{ width:60px; border:1px solid #888}
  div.space{margin:10px;}
</style>
