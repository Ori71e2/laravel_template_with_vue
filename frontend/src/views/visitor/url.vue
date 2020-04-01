
<template>
  <div :style="urlListStyle" class="url-list">
    {{ distance }}
    <div v-for="(urlPage, pageIndex) in urlList" :key="pageIndex" :ref="'anchor' + pageIndex">
      <!-- <div :ref="'anchor' + pageIndex" style="display: none;"></div> -->
      <draggable v-model="urlPage.page" v-bind="groupDragOptions" :move="onMove" element="div" @start="groupStart" @end="groupEnd">
        <div v-for="(urlGroup, groupIndex) in urlPage.page" :key="groupIndex"  :style="urlGroupStyle" class="url-group">
          <div :style="urlGroupTitleStyle" class="url-group-title">
            <span v-if="!edit">{{ urlGroup.title }}</span>
            <span v-else @click="handleEdit('group', pageIndex, groupIndex, urlIndex)">{{ urlGroup.title }}</span>
          </div>
          <draggable v-model="urlGroup.group" v-bind="boxDragOptions" :move="onMove" element="div" @start="boxStart" @end="boxEnd" :class="pageClass">
            <transition v-for="(url, urlIndex) in urlGroup.group" :key="urlIndex" name="fade" >
              <div :style="boxStyle" class="url-box">
                <a v-if="!edit" href=url.url target="_blank">
                  <span>{{ url.title }}{{ urlIndex }}</span>
                </a>
                <a v-else>
                  <span @click="handleEdit('url', pageIndex, groupIndex, urlIndex)">{{ url.title }}{{ urlIndex }}</span>
                </a>
              </div> 
            </transition>
            <div :style="boxStyle" class="url-box url-box-add">
              <a href='' target="_blank">
                <span>Add</span>
              </a>
            </div>
          </draggable>
        </div>
      </draggable>
    </div>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true" style="z-index: 199!important">
      <span>这是一段信息</span>
      <el-input placeholder="请输入内容" v-model="item.title">
        <template slot="prepend">名称</template>
      </el-input>
      <el-input v-if="this.item.type === 'url'" placeholder="请输入内容" v-model="item.url">
        <template slot="prepend">网址</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
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
    },
    'position': {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      windowWidth: 1000,
      urlPageOffsetLeft: 0,
      unitnum: 3,
      // colnum: 4,
      urlPageBorder: 1,
      boxWidth: 100,
      boxPaddingLR: 1,
      boxBorder: 1,
      boxMarginLR: 1,
      UCBoxMarginR: 50,
      dialogVisible: false,
      item: {
        type: '',
        pageIndex: -1,
        groupIndex: -1,
        urlIndex: -1,
        title: '',
        url: ''
      }
    }
  },
  computed: {
    urlList: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('update:list', val)
      }
    },
    distance: {
      get() {
        const index = 'anchor' + this.position
        if (this.$refs[index]) {
          // console.log(this.$refs[index][0])
          window.scrollTo(0, this.$refs[index][0].offsetTop - 80)
        }
        return this.index
      },
      // set(val) {
      //   this.$emit('update:position', val)
      // }
    },
    divDrag: {
      get() {
        return this.drag
      },
      set(val) {
        this.$emit('update:drag', val)
      }
    },
    boxDragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: true,
        disabled: !this.divDrag.box,
        ghostClass: 'ghost'
      }
    },
    groupDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.divDrag.group,
        ghostClass: 'ghost'
      }
    },
    pageClass: function() {
      let pageItem = []
      for(let i=1; i<11; i++) {
        let item = []
        for (let j=1; j<11; j++) {
          let string = ['page', 'item', i, j].join('-')
          item.push(string) 
        }
        pageItem.push(item)
      }
      return pageItem[this.unitnum - 1][this.colnum - 1]
    },
    urlGroupTitleStyle: function() {
      return { width: this.boxWidth + 'px' }
    },
    urlGroupStyle: function() {
      return { borderWidth: this.urlPageBorder + 'px'}
    },
    colnum() {
      const boxBase1 = (this.boxWidth + (this.boxMarginLR + this.boxBorder + this.boxPaddingLR)*2)
      const boxBase2 = (this.boxWidth + (this.boxPaddingLR + this.boxBorder)*2 + this.UCBoxMarginR + this.boxMarginLR)
      const boxToUrlPage = this.urlPageBorder * 2
      let base = 240
      let num = Math.floor((this.windowWidth - boxBase1 + boxBase2 - boxToUrlPage - base) / ((this.unitnum-1)*boxBase1 + boxBase2))
      return num
    },
    urlListStyle: function() {
      const boxBase1 = (this.boxWidth + (this.boxMarginLR + this.boxBorder + this.boxPaddingLR)*2)
      const boxBase2 = (this.boxWidth + (this.boxPaddingLR + this.boxBorder)*2 + this.UCBoxMarginR + this.boxMarginLR) 
      const boxToUrlPage = this.urlPageBorder * 2
      const width = ((this.unitnum-1)*this.colnum + 1)*boxBase1 + (this.colnum - 1)*boxBase2 + boxToUrlPage;
      return { width: width + 'px' }
    },
    boxStyle: function() {
      return { width: this.boxWidth + 'px', borderWidth: this.boxBorder + 'px' }
    }
  },
  watch: {
  },
  created() {
    this.getWindowWidth()
    window.addEventListener('resize', this.handleWindowResize, false)
  },
  mounted() {
  },
  destroyed() {
     window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize() {
      this.windowWidth = document.body.clientWidth
      console.log(document.body.clientWidth)
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    groupStart() {
      Object.keys(this.divDrag).forEach((key) => {
        if (key !== 'group') {
          this.divDrag[key] = false
        }
      })
    },
    groupEnd() {
      Object.keys(this.divDrag).forEach((key) => {
        this.divDrag[key] = true
      })
    },
    boxStart() {
      Object.keys(this.divDrag).forEach((key) => {
        if (key !== 'box') {
          this.divDrag[key] = false
        }
      })
    },
    boxEnd() {
      Object.keys(this.divDrag).forEach((key) => {
        this.divDrag[key] = true
      })
    },
    getWindowWidth() {
      this.windowWidth = document.body.clientWidth
    },
    handleEdit(type, pageIndex, groupIndex, urlIndex) {
      this.item.type = type
      this.item.urlIndex = urlIndex
      this.item.pageIndex = pageIndex
      this.item.groupIndex = groupIndex
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      const type = this.item.type
      const url = this.item.url
      const title = this.item.title
      const pageIndex = this.item.pageIndex
      const groupIndex = this.item.groupIndex
      const urlIndex = this.item.urlIndex
      let page = this.urlList[pageIndex]
      if (type == 'url') {
        page.page[groupIndex].group[urlIndex].url = url
        page.page[groupIndex].group[urlIndex].title = title
      } else if (type == 'group') {
        page.page[groupIndex].title = title
      } else if (type == 'page') {
        page.title = title
      }
      this.urlList.splice(pageIndex, 1, page)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  $boxPaddingLR: 1px;
  $boxBorder: 1px;
  $boxMarginLR: 1px;
  $UCBoxMarginR: 50px;
  .url-list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0px auto;
  }
  .url-group {
    border-width: 1px;
    border-style: solid;
    border-color: red;
    .url-group-title {
      border: solid $boxBorder red;
      border-radius: 2px;
      margin-left: $boxMarginLR;
      margin-right: $boxMarginLR;
      margin-bottom: 2px;
      background-color: #ffffff;
      height: 30px;
      display: block;
      position: relative;
      // 字体设置
      text-decoration: none;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      font-family: 'Microsoft Yahei', sans-serif;
      color: #474a4d;
      &:hover {
        font-size: 100%;
        color: #ffffff;
        background-color: #474a4d;
      }
    }
  }
  @for $unitnum from 1 through 10 {
    @for $colnum from 1 through 10 {
      .page-item-#{$unitnum}-#{$colnum} {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: 0px;
        div:nth-child(#{$unitnum}n+#{$unitnum}) {
          margin-right: $UCBoxMarginR !important;
        }
        div:nth-child(#{$unitnum*$colnum}n+#{$unitnum*$colnum}) {
          margin-right: $boxMarginLR !important;
        }
      }
    }
  }
  .url-box {
    border: solid red;
    box-sizing: content-box;
    border-radius: 2px;
    margin: 3px $boxMarginLR;
    padding: $boxPaddingLR;
    background-color: #ffffff;
    height: 45px;
    display: block;
    position: relative;
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
  .url-box-add {
    border: dashed 1px red;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0;
  }
</style>
