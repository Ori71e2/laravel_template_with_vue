
<template>
  <div :style="urlListStyle" class="url-list">
    <!-- {{ this.$store.getters.urlList }} -->
    <div v-for="(urlPage, pageIndex) in urlList" :key="pageIndex" :ref="'anchor' + pageIndex" class="url-page">
      <!-- <div :ref="'anchor' + pageIndex" style="display: none;"></div> -->
      <draggable v-model="urlPage.page" v-bind="urlGroupDragOptions" :move="onMove" element="div" :group="{ name: 'urlGroup', pull: true, put: ['urlGroup'] }" @end="urlGroupDragEnd">
        <div v-for="(urlGroup, groupIndex) in urlPage.page" :key="groupIndex" :style="urlGroupStyle" class="url-group">
          <div :style="urlGroupTitleStyle" class="url-group-title">
            <span v-if="!isEdit">{{ urlGroup.title }}</span>
            <a v-else @click="handleEdit('group', pageIndex, groupIndex, -1, '', '', [])">{{ urlGroup.title }}</a>
          </div>
          <draggable v-model="urlGroup.group" v-bind="urlItemDragOptions" :move="onMove" element="div" :class="urlGroupClass" :group="{ name: 'urlItem', pull: true, put: ['urlItem'] }" @end="urlItemDragEnd">
            <transition v-for="(url, urlIndex) in urlGroup.group" :key="urlIndex" name="fade">
              <div :style="urlItemStyle" class="url-box">
                <a v-if="!isEdit" href="url.url" target="_blank">
                  <span>{{ url.title }}</span>
                </a>
                <a v-else>
                  <span @click="handleEdit('url', pageIndex, groupIndex, urlIndex, url.title, url.url,url.tag)">{{ url.title }}</span>
                </a>
              </div>
            </transition>
            <div :style="urlItemStyle" class="url-box url-box-add">
              <a href="" target="_blank">
                <span>Add</span>
              </a>
            </div>
          </draggable>
        </div>
      </draggable>
    </div>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :append-to-body="true" style="z-index: 199!important">
      <el-input v-model="editItemOnType.title" placeholder="请输入内容">
        <template slot="prepend">名称</template>
      </el-input>
      <el-input v-if="itemType === 'url'" v-model="editItemOnType.url" placeholder="请输入内容">
        <template slot="prepend">网址</template>
      </el-input>
      <div v-if="itemType === 'url'" class="tag">
        <el-button @click="handleUrlItemTagEdit">标签</el-button>
        <el-tooltip class="tag-list" effect="dark" content="点击左边便签进行编辑" placement="bottom">
          <draggable v-model="editItemTag" v-bind="dragOptions" element="div" :group="{ name: 'editTagStore', pull: false, put: ['editTagStore'] }" class="tag-list">
            <transition v-for="tag in editItemTag" :key="tag.id" name="fade">
              <div class="tag-item">
                <el-tag class="item" :style="{backgroundColor: tag.color, borderColor:tag.color, color: 'white'}"> {{ tag.title }}</el-tag>
              </div>
            </transition>
          </draggable>
        </el-tooltip>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <tag :show.sync="isTag" :tag.sync="editItemTagId" type="select"/>
  </div>
</template>>

<script>
import draggable from 'vuedraggable'
import tag from './tag'
export default {
  components: {
    draggable, tag
  },
  data() {
    return {
      initWindowWidth: 1000,
      urlPageOffsetLeft: 0,
      urlPageBorder: 1,
      urlItemGatherNum: 3,
      urlItemDivWidth: 100,
      urlItemDivPaddingLR: 1,
      urlItemDivBorder: 1,
      urlItemDivMarginLR: 1,
      urlItemColumnGutter: 50,
      dialogVisible: false,
      editItemOnType: {
        type: '',
        pageIndex: -1,
        groupIndex: -1,
        urlIndex: -1,
        title: '',
        url: ''
      },
      editItemTagId: [],
      isTag: false
    }
  },
  computed: {
    urlList: {
      get() {
        const urlListTrigger = this.urlListTrigger
        return this.$store.getters.urlList
      },
      set(val) {
        this.$store.dispatch('url/setList', val)
      }
    },
    urlListTrigger: {
      get() {
        return this.$store.state.url.urlListTrigger
      },
      set(val) {
        this.$store.dispatch('url/setListTrigger', val)
      }
    },
    urlTag: {
      get() {
        // const urlListTrigger = this.urlListTrigger
        return this.$store.state.url.tag
      },
      set(val) {
        this.$store.dispatch('url/setTag', val)
      }
    },
    editItemTag: {
      get() {
        if (this.editItemTagId.length === 0 || this.urlTag.length ===0) {
          return []
        } else {
          const tag = this.editItemTagId.map((id, index) => {
            const filterTags = this.urlTag.filter(tag => { return tag.id === id})
            return filterTags.length > 0 ? filterTags[0] : []
          })
          return tag
        }
      },
      set(val) {
        if (val) {
          this.editItemTagId = val.map(tag => { return tag.id })
        }
      }
    },
    isDrag: {
      get() {
        return this.$store.state.url.drag
      },
      set(val) {
        this.$store.dispatch('url/setDrag', val)
      }
    },
    isEdit: {
      get() {
        return this.$store.state.url.edit
      },
      set(val) {
        this.$store.dispatch('url/setEdit', val)
      }
    },
    scroll() {
      return this.$store.state.url.scroll
    },
    distance: {
      get() {
        const index = 'anchor' + this.$store.state.url.position
        if (this.$refs[index]) {
          const length = this.$refs[index][0].offsetTop - 80
          return length
        }
        return 0
      }
    },
    isDrag: {
      get() {
        return this.$store.state.url.drag
      },
      set(val) {
        this.$store.dispatch('url/setDrag', val)
      }
    },
    itemType() {
      return this.editItemOnType.type
    },
    urlItemDragOptions() {
      return {
        animation: 0,
        group: 'description',
        filter: '.url-box-add',
        disabled: !this.isDrag,
        ghostClass: 'ghost'
      }
    },
    urlGroupDragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.isDrag,
        ghostClass: 'ghost'
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    urlGroupClass: function() {
      const pageItem = []
      for (let i = 1; i < 11; i++) {
        const item = []
        for (let j = 1; j < 11; j++) {
          const string = ['page', 'item', i, j].join('-')
          item.push(string)
        }
        pageItem.push(item)
      }
      return pageItem[this.urlItemGatherNum - 1][this.itemColumnNum - 1]
    },
    urlGroupTitleStyle: function() {
      return { width: this.urlItemDivWidth + 'px' }
    },
    urlGroupStyle: function() {
      return { borderWidth: this.urlPageBorder + 'px' }
    },
    itemColumnNum() {
      const boxBase1 = (this.urlItemDivWidth + (this.urlItemDivMarginLR + this.urlItemDivBorder + this.urlItemDivPaddingLR) * 2)
      const boxBase2 = (this.urlItemDivWidth + (this.urlItemDivPaddingLR + this.urlItemDivBorder) * 2 + this.urlItemColumnGutter + this.urlItemDivMarginLR)
      const boxToUrlPage = this.urlPageBorder * 2
      const base = 240
      const num = Math.floor((this.initWindowWidth - boxBase1 + boxBase2 - boxToUrlPage - base) / ((this.urlItemGatherNum - 1) * boxBase1 + boxBase2))
      return num
    },
    urlListStyle: function() {
      const boxBase1 = (this.urlItemDivWidth + (this.urlItemDivMarginLR + this.urlItemDivBorder + this.urlItemDivPaddingLR) * 2)
      const boxBase2 = (this.urlItemDivWidth + (this.urlItemDivPaddingLR + this.urlItemDivBorder) * 2 + this.urlItemColumnGutter + this.urlItemDivMarginLR)
      const boxToUrlPage = this.urlPageBorder * 2
      const width = ((this.urlItemGatherNum - 1) * this.itemColumnNum + 1) * boxBase1 + (this.itemColumnNum - 1) * boxBase2 + boxToUrlPage
      return { width: width + 'px' }
    },
    urlItemStyle: function() {
      return { width: this.urlItemDivWidth + 'px', borderWidth: this.urlItemDivBorder + 'px' }
    }
  },
  watch: {
    scroll: function(newVal, oldVal) {
      window.scrollTo(0, this.distance)
    }
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
      this.initWindowWidth = document.body.clientWidth
    },
    onMove({ relatedContext, draggedContext }) {
      // Add div 区域由于未设置任何数据，无法获取相关数据内容，若要使用这个函数，做好空判断
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // )
    },
    urlGroupDragEnd() {
      this.urlListTrigger += 1
    },
    urlItemDragEnd() {
      this.urlListTrigger += 1
    },
    getWindowWidth() {
      this.initWindowWidth = document.body.clientWidth
    },
    handleEdit(type, pageIndex, groupIndex, urlIndex, title, url, tag) {
      this.editItemOnType.type = type
      this.editItemOnType.urlIndex = urlIndex
      this.editItemOnType.pageIndex = pageIndex
      this.editItemOnType.groupIndex = groupIndex
      this.editItemOnType.title = title
      this.editItemOnType.url = url
      this.editItemTagId = JSON.parse(JSON.stringify(tag))
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleConfirm() {
      const type = this.editItemOnType.type
      const url = this.editItemOnType.url
      const title = this.editItemOnType.title
      const pageIndex = this.editItemOnType.pageIndex
      const groupIndex = this.editItemOnType.groupIndex
      const urlIndex = this.editItemOnType.urlIndex
      const tag = JSON.parse(JSON.stringify(this.editItemTagId))
      // const page = JSON.parse(JSON.stringify(this.urlList[pageIndex]))
      const page = this.urlList[pageIndex]
      if (type === 'url') {
        page.page[groupIndex].group[urlIndex].url = url
        page.page[groupIndex].group[urlIndex].title = title
        page.page[groupIndex].group[urlIndex].tag = tag
      } else if (type === 'group') {
        page.page[groupIndex].title = title
      } else if (type === 'page') {
        page.title = title
      }
      this.urlList[pageIndex] = page
      this.urlListTrigger += 1
      this.dialogVisible = false
    },
    handleUrlItemTagEdit() {
      this.isTag = true
    }
  }

}
</script>

<style lang="scss" scoped>
  $urlItemDivPaddingLR: 1px;
  $urlItemDivBorder: 1px;
  $urlItemDivMarginLR: 1px;
  $urlItemColumnGutter: 50px;
  .url-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0px auto;
    .url-page:nth-of-type(odd) {
      // border
      margin-bottom: 20px;
      border-bottom: 3px solid #909399;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
    }
  }
  .url-group {
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    margin: 4px 0px;
    .url-group-title {
      box-sizing: content-box;
      // border: 1px solid #d8dce5;
      // box-shadow: 0 1px 4px rgba(0,21,41,.08);
      border-radius: 2px;
      margin-left: $urlItemDivMarginLR;
      margin-right: $urlItemDivMarginLR;
      padding: 0px $urlItemDivPaddingLR;
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
  @for $urlItemGatherNum from 1 through 10 {
    @for $itemColumnNum from 1 through 10 {
      .page-item-#{$urlItemGatherNum}-#{$itemColumnNum} {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin: 0px;
        div:nth-child(#{$urlItemGatherNum}n+#{$urlItemGatherNum}) {
          margin-right: $urlItemColumnGutter !important;
        }
        div:nth-child(#{$urlItemGatherNum*$itemColumnNum}n+#{$urlItemGatherNum*$itemColumnNum}) {
          margin-right: $urlItemDivMarginLR !important;
        }
      }
    }
  }
  .url-box {
    // border: 1px solid #d8dce5;
    // box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-sizing: content-box;
    border-radius: 2px;
    margin: 3px $urlItemDivMarginLR;
    padding: $urlItemDivPaddingLR;
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
    border: 1px solid #d8dce5;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0;
  }
  .tag {
    width: 100%;
    min-height: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
  }
  .tag-list {
    width: calc(100% - 68px);
    min-height: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    white-space: nowrap;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    font-weight: 500;
    padding: 4px 6px;
    font-size: 14px;
    border-radius: 4px;
  }
</style>
