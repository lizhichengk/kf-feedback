<template>
  <el-drawer
    class="feedback feedback-shadow"
    :style="{right: right+'px', top: 0}"
    :visible.sync="drawer"
    :modal="false"
    direction="rtl">
    <div slot='title'>
      <span>用户反馈</span>
      <i @click='close' class='iconfont icon-pupupClose'></i>
    </div>
    <div class='top'>
      <span>用户手机号：</span>
      <el-input clearable v-model.trim="phone" size="medium" placeholder="请输入用户手机号"></el-input>
      <el-button type="primary" size="medium" @click='search(phone)'>查询</el-button>
    </div>
    <div class='content' v-loading='loading'>
      <Empty v-if='JSON.stringify(data) === "{}"'></Empty>
      <div class='item-wrap'>
        <div class='item' :key='id' v-for='(k,id) in data'>
          <div class='title'>
            <i class='iconfont icon-duanxin'></i>
            <span>用户短信</span>
            <span class='createtime'>{{formatDateTime(k.createTime*1000)}}</span>
          </div>
          <div class='worktask' v-if='k.taskName && k.id'>
            <span>工单编号：{{k.taskName}}</span>
            <span @click='gotoSwan(k.taskId, k.taskName)'>查看</span>
          </div>
          <div :class="['text',noChose?'noChose':'']" v-show='k.text'>
            <el-checkbox v-if='!noChose' v-model="k.addText" @change="(val) => { handleChange(val,id) }"></el-checkbox>
            <span>{{k.text}}</span>
          </div>
          <div :class="['imgs', noChose?'noChose-imgs':'']" v-show="k.file.length">
            <el-checkbox-group v-model="k.checkedImgList">
              <div class='img-wrap' :key='itemIndex' v-for='(item,itemIndex) in k.file'>
              <el-image
                fit='contain'
                style="width: 80px; height: 80px"
                :src="item.url"
                :preview-src-list="getImgList(k.file,itemIndex)">
              </el-image>
              <el-checkbox v-if='!noChose' :label="item" @change="(val) => { handleChange(val,id) }"></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div class='operate' v-show='(k.text || k.file.length) && !noChose'>
            <el-checkbox v-model="k.checkAll" @change="(val) => { handleCheckAllChange(val,id) }">全选</el-checkbox>
            <el-button type="primary" size="medium" @click='add(id)'>填入工单</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import Api from '../api';
import Service from '../service';
import Empty from '../empty/empty';
export default {
  name: 'feedback',
  components: { Empty },
  props: {
    url: {
      type: String,
      required: false
    },
    right: {
      type: [String, Number],
      required: false,
      default: '500'
    },
    noChose: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      phone: '',
      data: {},
      drawer: false,
      loading: false
    };
  },
  methods: {
    show(initPhone) {
      this.drawer = true;
      if(initPhone) {
        this.phone = initPhone;
        this.search(initPhone);
      }
    },
    search(initPhone) {
      if (!initPhone) {
        return;
      }
      this.loading = true;
      this.data = {};
      Service.get(this.url || Api.getList, {phone: initPhone})
        .then((res) => {
        this.loading = false;
          if (res.errNo === 0) {
            const data = res.data.list;
            data.forEach((item) => {
              this.$set(this.data, `id_${item.id}`, {
                ...item,
                addText: false,
                checkAll: false,
                checkedImgList: [], // item.file,
              })
            })
          } else {
            this.$message.error(res.errStr);
          }
        });
    },
    // 图片位置处理
    getImgList(imgList, index) {
      const list = [];
      imgList.forEach((item) => {
        list.push(item.url)
      })
      const preList = list.slice(0,index);
      const url = list[index];
      const nextList = list.slice(index+1, list.length);
      return [].concat([url],nextList,preList);
    },
    gotoSwan(taskId,taskName) {
      const path = `/swan/platform/home/worktask/detail/${taskId}?taskName=${taskName}`;
      window.open(path, '_blank');
    },
    handleChange(val, id) {
      const item = this.data[id];
      if (!val) {
        item.checkAll = false;
      } else {
        const textFlag = item.text ? item.addText : true;
        const imgFlag = item.file && item.file.length ? item.checkedImgList.length === item.file.length : true;
        if ( textFlag && imgFlag) {
          item.checkAll = true;
        } else {
          item.checkAll = false;
        }
      }
    },
    /*
    * 时间戳格式化方法
    * @param {int} timestamp 时间戳(单位:毫秒/秒)
    * @param {string} format 'yyyy-MM-dd hh:mm:ss EEE'
    * @return {string} 时间字符串 '2018-12-27 12:02:02'
    */
    formatDateTime(timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      if (timestamp && (timestamp + '').length < 13) {
        timestamp *= 1000;
      }

      const date = new Date(timestamp);
      const o = {
        // 月份
        'M+': date.getMonth() + 1,
        // 日
        'd+': date.getDate(),
        // 小时
        'h+': date.getHours(),
        // 分
        'm+': date.getMinutes(),
        // 秒
        's+': date.getSeconds(),
        // 季度
        'q+': Math.floor((date.getMonth() + 3) / 3),
        // 毫秒
        'S': date.getMilliseconds(),
      };
      const week = {
        0: '\u65e5',
        1: '\u4e00',
        2: '\u4e8c',
        3: '\u4e09',
        4: '\u56db',
        5: '\u4e94',
        6: '\u516d',
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }

      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '（\u661f\u671f' : '（\u5468') : '（')
          + week[date.getDay() + ''] + '）');
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    },
    handleCheckAllChange(val, id) {
      const item = this.data[id];
      if (val) {
        item.addText = true;
        item.checkAll = true;
        item.checkedImgList = item.file;
      } else {
        item.addText = false;
        item.checkAll = false;
        item.checkedImgList = [];
      }
    },
    close() {
      this.drawer = false;
      this.data = {};
      this.phone = '';
    },
    add(id) {
      const item = this.data[id];
      const sendData = {
        text: item.addText ? item.text : '',
        imgList: item.checkedImgList,
      }
      this.$emit('setData', sendData);
      item.addText = false;
      item.checkAll = false;
      item.checkedImgList = [];
    }
  }
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
