<template>
  <el-dialog title="标签列表" :visible.sync="isTag" width="70%" model-append-to-body class="dialog-custom">
    <div class="main">
      <!-- {{ urlTag }} -->
      <div class="tag-selected">
        <div class="delete">
          <div class="icon"><i class="el-icon-delete" /></div>
          <draggable v-model="tagSelectedDeleted" v-bind="dragOptions" element="div" :group="{name: 'tag', put: ['tagSelected']}" class="drag" />
        </div>
        <draggable v-model="tagSelected" v-bind="dragOptions" element="div" :group="{name: 'tagSelected', put: ['tagStore']}" :move="onMove" @start="dragStart" @end="dragEnd" class="dragarea">
          <transition v-for="tag in tagSelected" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item"> {{ tag.title }} </el-tag>
            </div>
          </transition>
        </draggable>
      </div>
      <div class="tag-search">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="tag-store">
        <div class="operate">
          <div>
            <div class="icon"><i class="el-icon-edit" /></div>
            <draggable v-model="tagEdit" v-bind="dragOptions" @add="editTag" element="div" :group="{name: 'tagStoreEdit', put: ['tagStore']}" class="drag" />
          </div>
          <div>
            <div @click="tagStoreAdd" class="icon"><i class="el-icon-circle-plus-outline" /></div>
          </div>
          <div>
            <div class="icon"><i class="el-icon-delete" /></div>
            <draggable v-model="tagDeleted" v-bind="dragOptions" element="div" :group="{name: 'tagStoreDelete', put: ['tagStore']}" class="drag" />
          </div>
        </div>
        <draggable v-model="urlTag" v-bind="dragOptions" element="div" :group="{ name: 'tagStore', pull: 'clone', put: false }" :clone="clone" :move="onMove" @start="storeDragStart" @end="storeDragEnd" class="dragarea">
          <transition v-for="tag in urlTag" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item"> {{ tag.title }} </el-tag>
            </div>
          </transition>
        </draggable>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isTag = false">取 消</el-button>
      <el-button type="primary" @click="isTag = false">确 定</el-button>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" append-to-body :before-close="handleClose">
      <el-input placeholder="请输入内容" v-model="newTag.title">
        <template slot="prepend">标签名称</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmNewTag">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getUrlTag } from '@/api/url'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      search: '',
      tagSelectedDeleted: [],
      tagIdSelected: ['T15860802459600'],
      cloneTag: '',
      tagEdit: [],
      tagAdd: [],
      tagDeleted: [],
      dialogTitle: '',
      dialogVisible: false,
      editTagIndex: -1,
      newTag: {id: '', title: ''}
    }
  },
  computed: {
    urlTag: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.state.url.tag))
      },
      set(val) {
        this.$store.dispatch('url/setTag', val)
      }
    },
    tagSelected: {
      get() {
        if (this.tagIdSelected.length === 0 || this.urlTag.length ===0) {
          return []
        } else {
          const tag = this.tagIdSelected.map((id, index) => {
            const filterTags = this.urlTag.filter(tag => { return tag.id === id})
            if (filterTags.length > 0) {
              return filterTags[0]
            } else {
              return
            }
          })
          return tag
        }
      },
      set(val) {
        if (val) {
          this.tagIdSelected = val.map(tag => { return tag.id })
        }
      }
    },
    isTag: {
      get() {
        return this.$store.state.url.tagPopover
      },
      set(val) {
        this.$store.dispatch('url/setTagPopover', val)
      }
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: true,
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    getUrlTag().then(response => {
      this.urlTag = JSON.parse(response.data)
      this.$store.dispatch('url/setTag', this.urlTag)
    })
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    dragStart() {
    },
    dragEnd() {
    },
    storeDragStart() {
    },
    storeDragEnd() {
    },
    clone(e) {
      if(this.tagIdSelected.length === 0) {
        return { ...e }
      } else if(this.tagIdSelected.every(id => { return id != this.cloneTag.id })) {
        // console.log(this.cloneTag)
        return { ...e }
      }
    },
    tagStoreAdd() {
      let base = (new Date()).getTime()
      let tagId = 'T' + base
      while(this.urlTag.some(tag => { return tag.id === tagId})) {
        base += 1
        tagId = 'T' + base
      }
      this.newTag.id = tagId
      this.newTag.title = ''
      this.dialogTitle = '新增'
      this.dialogVisible = true
    },
    confirmNewTag() {
      console.log(this.newTag)
      this.dialogVisible = false
      if (this.dialogTitle === '新增') {
        this.urlTag.push({...this.newTag})
      } else {
        this.urlTag[this.editTagIndex] = {...this.newTag}
      }
      this.resetnewTag()
    },
    handleClose() {
      this.dialogVisible = false
      this.resetnewTag()
    },
    resetnewTag() {
      this.newTag.id = ''
      this.newTag.title = ''
    },
    editTag(e) {
      this.editTagIndex = e.oldIndex
      this.newTag = { ...this.urlTag[e.oldIndex] }
      this.dialogTitle = '修改'
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
$searchHeight: 50px;
$tagSelectedHeight: 100px;
$operateWidth: 60px;
$stars: (
  (background-color: #409EFF, border-color: #409EFF, color: #fff),
  (background-color: #67c23a, border-color: #67c23a, color: #fff),
  (background-color: #E6A23C, border-color: #E6A23C, color: #fff),
  (background-color: #F56C6C, border-color: #F56C6C, color: #fff),
  (background-color: #909399, border-color: #909399, color: #fff),
  (background-color: #8040FF, border-color: #8040FF, color: #fff),
  (background-color: #FC40FF, border-color: #FC40FF, color: #fff),
);

.dialog-custom {
  height: 90%;
}
.main {
  width: 99%!important;
  height: calc(70% - 50px);
  height: 500px;
  margin-bottom: 20px!important;
  margin-left: 10px;
  // overflow: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  // align-items: center;
}
.tag-selected {
  width: 100%;
  height: $tagSelectedHeight;
  border: solid 1px red;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  .delete {
    width: 60px;
    height: 100%;
    border: solid 1px red;
    .icon {
      position: relative;
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
      z-index: 99;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      align-content: space-around;
      i {
        font-weight: 400;
        font-size: 30px;
        color: #409EFF;
      }
      &:hover {
        i {
          font-weight: 400;
          font-size: 30px;
          color: red;
        }
      }
    }
    .drag {
      position: relative;
      width: 100%;
      height: 100%;
      left: 0px;
      top: -100%;
      z-index: 98;
    }
  }
  .dragarea {
    width: calc(100% - 60px);
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .tag-item {
      margin: 2px 4px;
      height: 32px;
      cursor: pointer;
    }
    @for $i from 1 through length($stars) {
      $item: nth($stars, $i);
      & div:nth-child(#{$i}n+#{$i}) {
        .item {
          background-color: map-get($item, background-color) !important;
          border-color: map-get($item, border-color) !important;
          color: map-get($item, color) !important;
        }
      }
    }
  }
}
.tag-search {
  width: 100%;
  height: $searchHeight;
  border: solid 1px red;
}
.tag-store {
  width: 100%;
  height: calc(100% - #{$searchHeight} - #{$tagSelectedHeight} - 10px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  border: solid 1px red;
  .operate {
    width: $operateWidth;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
    div {
      width: 100%;
      height: 33.33%;
      border: solid 1px red;
      .icon {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        z-index: 99;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
        i {
          font-weight: 400;
          font-size: 30px;
          color: #409EFF;
        }
        &:hover {
          i {
            font-weight: 400;
            font-size: 30px;
            color: red;
          }
        }
      }
      .drag {
        position: relative;
        width: 100%;
        height: 100%;
        left: 0px;
        top: -100%;
        z-index: 98;
      }
    }
  }
  .dragarea {
    width: calc(100% - #{$operateWidth});
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .tag-item {
      margin: 2px 4px;
      height: 32px;
      cursor: pointer;
    }
    @for $i from 1 through length($stars) {
      $item: nth($stars, $i);
      & div:nth-child(#{$i}n+#{$i}) {
        margin: 2px 4px;
        .item {
          background-color: map-get($item, background-color);
          border-color: map-get($item, border-color);
          color: map-get($item, color);
        }
      }
    }
  }
}
</style>
