<template>
  <el-dialog title="标签列表" :visible.sync="isTag" width="70%" model-append-to-body class="dialog-custom">
    <div class="main">
      {{ tagSelected }}
      <div class="tag-selected">
        <div class="delete">
          <div class="icon"><i class="el-icon-delete" /></div>
          <draggable v-model="tagSelectedDeleted" v-bind="dragOptions" element="div" :group="{name: 'tag', put: ['tagSelected']}" class="drag" />
        </div>
        <draggable v-model="tagSelected" v-bind="dragOptions" element="div" :group="{name: 'tagSelected', put: ['tagStore']}" :move="onMove" @start="dragStart" @end="dragEnd" class="dragarea">
          <transition v-for="tag in tagSelected" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item" :style="{backgroundColor: tag.color, borderColor: tag.color}"> {{ tag.title }}</el-tag>
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
            <draggable v-model="tagEdit" v-bind="dragOptions" @add="tagStoreEdit" element="div" :group="{name: 'tagStoreEdit', put: ['tagStore']}" class="drag" />
          </div>
          <div>
            <div @click="tagStoreAdd" class="icon"><i class="el-icon-circle-plus-outline" /></div>
          </div>
          <div>
            <div class="icon"><i class="el-icon-delete" /></div>
            <draggable v-model="tagDeleted" v-bind="dragOptions" element="div" :group="{name: 'tagStoreDelete', put: ['tagStore']}" class="drag" />
          </div>
        </div>
        <draggable v-model="tagSearch" v-bind="dragOptions" element="div" :group="{ name: 'tagStore', pull: 'clone', put: false }" :clone="clone" :move="onMove" @start="storeDragStart" @end="storeDragEnd" class="dragarea">
          <transition v-for="tag in tagSearch" :key="tag.id" name="fade">
            <div class="tag-item">
              <el-tag class="item" :style="{backgroundColor: tag.color, borderColor:tag.color}"> {{ tag.title }}</el-tag>
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
      <div v-show="!isValiadte" style="color: red; margin-left: 50%;">存在重复标签</div>
      <el-input placeholder="请输入内容" v-model="newTag.color">
        <el-color-picker v-model="newTag.color" :predefine="predefineColors" size="small" slot="prepend" style="margin-top: 4px;" />
      </el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :disabled="!isValiadte" type="primary" @click="confirmNewTag">确 定</el-button>
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
      tagEdit: [],
      tagAdd: [],
      tagDeleted: [],
      dialogTitle: '',
      dialogVisible: false,
      cloneTag: {},
      newTag: {id: '', title: '', color: '#409EFF'},
      predefineColors: [
        '#409EFF',
        '#67c23a',
        '#E6A23C',
        '#F56C6C',
        '#909399',
        '#8040FF',
        '#FC40FF'
      ],
      trigger: 0
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
    tagSearch: {
      get() {
        const trigger = this.trigger
        const urlTag = JSON.parse(JSON.stringify(this.urlTag))
        return urlTag.filter(tag => { return this.search === '' || tag.title.toLowerCase().includes(this.search.toLowerCase()) })
      },
      set(val) {
      }
    },
    tagSelected: {
      get() {
        const trigger = this.trigger
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
    },
    isValiadte() {
      return this.verify()
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
    dragStart() {
    },
    dragEnd() {
    },
    storeDragStart() {
    },
    storeDragEnd() {
    },
    clone(e) {
      console.dir(this.tagSelected)
      this.cloneTag = { ...e }
      if(this.tagIdSelected.length === 0) {
        return { ...e }
      } else if(this.tagIdSelected.every(id => { return id != this.cloneTag.id })) {
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
      this.newTag.color = '#409EFF'
      this.dialogTitle = '新增'
      this.dialogVisible = true
    },
    tagStoreEdit(e) {
      this.newTag = { ...this.urlTag.filter(tag => { return tag.id === this.cloneTag.id})[0] }
      this.dialogTitle = '修改'
      this.dialogVisible = true
    },
    verify() {
      if (this.urlTag.length === 0) {
        return true
      } else {
        const idEqualIndex = this.urlTag.findIndex(tag => { return  tag.id === this.newTag.id })
        const titleEqualIndex = this.urlTag.findIndex(tag => { return  tag.title === this.newTag.title })
        if (idEqualIndex === -1) {
          if (titleEqualIndex === -1) {
            return true
          }
        } else {
          if (idEqualIndex === titleEqualIndex){
            return true
          }
          if (titleEqualIndex === -1){
            return true
          }
        }
      }
      return false
    },
    confirmNewTag() {
      this.dialogVisible = false
      if (this.urlTag.length === 0) {
        this.trigger += 1
        this.urlTag.push({...this.newTag})
      } else {
        const idEqualIndex = this.urlTag.findIndex(tag => { return  tag.id === this.newTag.id })
        const titleEqualIndex = this.urlTag.findIndex(tag => { return  tag.title === this.newTag.title })
        // 未找到id表明是新增
        if (idEqualIndex === -1) {
          if (titleEqualIndex === -1) {
            this.trigger += 1
            this.urlTag.push({...this.newTag})
          }
        // 找到id表明为修改
        } else {
          // 未进行修改
          if (idEqualIndex === titleEqualIndex){
            this.trigger += 1
            this.urlTag.splice(idEqualIndex, 1, {...this.newTag})
          }
          // 修改值未重复
          if (titleEqualIndex === -1){
            this.trigger += 1
            this.urlTag.splice(idEqualIndex, 1, {...this.newTag})
          }
        }
      }
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
$searchHeight: 50px;
$tagSelectedHeight: 100px;
$operateWidth: 60px;
@mixin icon-drag {
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
.dialog-custom {
  height: 90%;
}
.main {
  width: 99%!important;
  height: calc(70% - 50px);
  height: 500px;
  margin-bottom: 20px!important;
  margin-left: 10px;
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
    @include icon-drag;
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
      .item {
        color: white;
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
      @include icon-drag;
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
      .item {
        color: white;
      }
    }
  }
}
</style>
