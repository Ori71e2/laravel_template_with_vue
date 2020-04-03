
<template>
  <div class="operate">
    <div v-if="visible" class="content box animated fadeInUp">
      <i @click="isEdit = !isEdit" :class="[isEdit ? activeClass : inactiveClass]" class="el-icon-edit"></i>
      <i @click="setDrag" :class="[isDrag ? activeClass : inactiveClass]" class="el-icon-rank"></i>
      <i :class="[isRecycleBinEmpty ? inactiveClass : activeClass]" class="el-icon-delete"></i>
      <!-- <i class="el-icon-back"></i>
      <i class="el-icon-right"></i> -->
      <i @click="save()" :class="[isUpdate ? activeClass : inactiveClass]" class="el-icon-circle-check"></i>
    </div>
    <div v-else class="content"></div>
    <div @click="popOver" class="button" slot="reference"><i class="el-icon-caret-top caret"/></div>
  </div>
</template>>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    'list': {
      type: Array,
      default: []
    },
    'drag' : {
      type: Object,
      default: {}
    },
    'edit': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      recycleBin: [],
      history: [],
      activeClass: 'active',
      inactiveClass: 'inactive',
      isDrag: false,
      oldUrlList: []
    }
  },
  computed: {
    urlList: {
      get() {
        return JSON.parse(JSON.stringify(this.list))
      },
      set(val) {
        this.$emit('update:list', JSON.parse(JSON.stringify(val)))
      }
    },
    pageIndex: {
      get() {
        return this.position
      },
      set(val) {
        this.$emit('update:position', val)
      }
    },
    isEdit: {
      get() {
        return this.edit
      },
      set(val) {
        this.$emit('update:edit', val)
        console.log(val)
      }
    },
    // isSave: {
    //   get() {
    //     return this.isDrag || this.isEdit || this.update
    //   }
    // },
    isUpdate() {
      if (this.oldUrlList.length != 0) {
        let oldString = JSON.stringify(this.oldUrlList)
        let newString = JSON.stringify(this.urlList)
        let oldLen = oldString.length
        let newLen = newString.length
        if (oldLen != newLen) {
          return true
        } else {
          for(let i = 0; i < oldLen; i++) {
            if(oldString[i] != newString[i]) {
              return true
            }
          }
          return false
        }
      } else {
        return false
      }
    },
    isRecycleBinEmpty(){
      return this.recycleBin.length == 0 ? true : false
    }
  },
  watch: {
  },
  created() {
    this.oldUrlList = this.urlList.slice()
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    popOver() {
      this.visible = !this.visible
    },
    setDrag() {
      let flag = this.drag
      this.isDrag = !this.isDrag
      Object.keys(this.drag).forEach((key) => {
        flag[key] = this.isDrag
      })
      this.$emit('update:drag', flag)
    },
    save() {
      this.oldUrlList = this.urlList.slice()
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  width: 30px;
  height: 30px;
  border: solid 1px red;
}
.content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 20px auto;
  width: 30px;
  height: 210px;
  overflow: auto;
  i {
    width: 100%;
    height: 30px;
    font-weight: 400;
    font-size: 30px;
  }
}
.active {
  color: #409EFF
}
.inactive {
  color: #909399;
}
.hidden {
  visibility: hidden;
}
.show {
  visibility: visible;
}
.caret {
  font-weight: 400;
  font-size: 30px;
  color: #409EFF
}
.url-page-title {
  border: solid 1px red;
  box-sizing: content-box;
  border-radius: 2px;
  margin: 3px 1px;
  background-color: #ffffff;
  width: calc(100% - 3px);
  height: 45px;
  // 字体设置
  text-decoration: none;
  line-height: 45px;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei', sans-serif;
  color: #474a4d;
  // div内文字不溢出，溢出部分用...代替
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 10;
  &:hover {
    font-size: 110%;
    color: #ffffff;
    background-color: #474a4d;
  }
}
</style>
