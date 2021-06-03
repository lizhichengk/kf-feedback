<template>
  <div class='empty'>
    <div class='wrap'>
      <img :src="url||EmptySvg"/>
      <div class='text'>{{text||'暂无数据'}}</div>
    </div>
  </div>
</template>
<script>
import EmptySvg from '../assets/empty.svg';
export default {
  name: 'Empty',
  props:['url', 'text'],
  data() {
    return {
      EmptySvg: EmptySvg
    }
  }
}
</script>
<style lang="less">
  .empty{
    height: 164px;
    position: relative;
    .wrap{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      img{
        width: 80px;
        height: 80px;
      }
      .text{
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: #999;
      }
    }
  }
</style>
