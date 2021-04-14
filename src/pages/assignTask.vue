<template>
  <div>

    <div class="head">
      <p style="font-size: 20px; ">划分任务页面</p>
    </div>

    <div class="container">
      <div class="left-group">
        <el-table
          ref="multipleTable"
          :data="tableData.slice((leftCurrentPage-1)*pageSize,leftCurrentPage*pageSize)"
          tooltip-effect="dark"
          row-key="item_id"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            :selectable="checkboxT"
            disabled="true"
            :reserve-selection='true'
            width="55">
          </el-table-column>
          <el-table-column
            prop="item_id"
            label="ID"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="词条名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="field"
            label="领域"
            width="120">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handlePreview(scope.row)">预览
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination @size-change="handleLeftSizeChange" @current-change="handleLeftCurrentChange"
                       :current-page="leftCurrentPage"
                       :page-size="pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>

        <entryReview :form="selectTable" :drawerFlag="drawerFlag" v-on:handleClose="handleClose"></entryReview>
      </div>

      <div class="mid-group">
        <div class="mid-button-center">
          <span>已选择{{ selectedCount }}条词条</span>
          <br/>
          <el-button @click="handleComplete()">完善词条</el-button>
          <br/>
          <el-button @click="dialogCreateVisible=true">新建词条</el-button>
          <br/>
          <el-button @click="dialogCheckVisible=true">审核词条</el-button>
          <br/>
        </div>
        <div class="mid-button-bottom">
          <span>待发布{{ subtaskTableData.length }}项任务</span>
          <br/>
          <el-button type="primary" @click="handleAssignConfirm()">发布任务</el-button>
          <br/>
          <el-alert
            title="一次性发布任务数不能超过10项"
            cneter
            show-icon
            type="warning"
            :closable="false">
          </el-alert>
        </div>
        <el-dialog
          title="新建词条"
          :visible.sync="dialogCreateVisible"
          width="30%">
          <el-input v-model="createInput" placeholder="请输入新建词条数"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCreate(createInput)">发 布</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="审核词条"
          :visible.sync="dialogCheckVisible"
          width="30%">
          <el-input v-model="checkInput" placeholder="请输入审核人员数"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCheckVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCheck(checkInput)">发 布</el-button>
          </span>
        </el-dialog>
      </div>

      <div class="right-group">
        <el-table
          :data="subtaskTableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="任务类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="content"
            label="任务描述"
            width="120">
          </el-table-column>
          <el-table-column
            prop="itemCount"
            label="词条/人员数"
            width="120">
          </el-table-column>
          <el-table-column
            prop="money"
            label="任务金额"
            width="100">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="220"
                trigger="hover">
                <el-form :model="scope.row" label-width="80px">
                  <el-form-item label="任务类型">
                    <span>{{scope.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="任务描述">
                    <span>{{scope.row.content}}</span>
                  </el-form-item>
                  <el-form-item label="词条数" v-show="scope.row.type !== 3">
                    <span>{{scope.row.itemCount}}</span>
                  </el-form-item>
                  <el-form-item label="人员数" v-show="scope.row.type === 3">
                    <span>{{scope.row.itemCount}}</span>
                  </el-form-item>
                  <el-form-item label="id列表" v-show="scope.row.type === 2">
                    <span>{{scope.row.itemTable}}</span>
                  </el-form-item>
                  <el-form-item label="任务金额">
                    <span>{{scope.row.money}}</span>
                  </el-form-item>

                </el-form>
                <el-button size="mini" slot="reference">详情</el-button>
              </el-popover>

              <el-button
                type="danger"
                size="mini"
                @click="handleUndo(scope.$index,scope.row)">撤销
              </el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>

    </div>

  </div>
</template>

<script>
import entryReview from '../components/entryReview'

export default {
  name: 'assignTask',
  inject: ['reload'],
  components: {
    entryReview
  },
  data() {
    return {
      task_id: 0,
      user_id: 0,
      user_token: '',

      leftCurrentPage: 1, // 初始化词条表格的当前页
      pageSize: 10, // 表格每页展示的词条数量

      selectTable: {}, // 当前需要预览的词条的所有信息，传给entryReview完成预览
      tableData: [],
      subtaskTableData: [], // 待发布的任务数组
      multipleSelection: [], // 表格的选中行的数组
      disableItemTable: [], // 发布完善任务后的词条不能再选中
      dialogCreateVisible: false,
      dialogCheckVisible: false,
      drawerFlag: false,
      createInput: '',
      checkInput: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 调用获取
      // this.tableData = []

      this.getInitItems() // 需要改成从后端获取数据

      if (JSON.stringify(this.$route.params) == '{}') {
        console.log('读取session信息')
        let loginData = JSON.parse(window.sessionStorage.getItem('user'))
        this.user_id = loginData.user_id
        this.user_token = loginData.user_token
        this.task_id = loginData.task_id
      } else {
        this.user_id = this.$route.params.user_id
        this.user_token = this.$route.params.user_token
        this.task_id = this.$route.params.task_id
        let loginData = JSON.stringify({user_id: this.user_id, task_id: this.task_id})
        window.sessionStorage.setItem('user', loginData)
      }
    },
    getInitItems() {
      for (let i = 1; i < 109; i++) {
        let test = {
          item_id: i,
          original_id: -1,
          name: '柴犬',
          field: [],
          imageUrl: '',
          intro: 'intro',
          info_box: [],
          content: 'content',
          reference: [],
          relation: [],
          has_selected_supply: 0,
          status: 0
        }
        this.tableData.push(test)
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    checkboxT(row, index) {
      if (this.disableItemTable.includes(row.item_id)) {
        return 0
      } else if (row.has_selected_supply === 1) {
        return 0
      } else {
        return 1
      }
    },
    addSubtask(type, money, itemCount, itemTable) {
      if (this.subtaskTableData.length >= 10) {
        this.displayMessage('warning', '待发布任务数达到上限，请先发布或者撤销任务')
        return
      }
      let typeNameTable = ['新建', '完善', '审核']
      let typeName = typeNameTable[type - 1]
      this.subtaskTableData.push({
        name: typeName + '词条',
        content: typeName + itemCount.toString() + '条词条',
        type: type,
        money: money,
        itemCount: itemCount,
        itemTable: itemTable
      })
    },
    handleComplete() {
      let selectedTable = []
      let selectedItemTable = []
      this.multipleSelection.forEach(sel => {
        selectedTable.push(sel)
        selectedItemTable.push(sel.item_id)
        this.disableItemTable.push(sel.item_id)
      })
      if (selectedItemTable.length <= 0) {
        this.displayMessage('warning', '请选择至少一条词条')
        return
      }
      this.addSubtask(2, 500.00, selectedItemTable.length, selectedItemTable)
      this.toggleSelection(selectedTable)
    },
    handleCreate(input) {
      if (input.length > 0) {
        let itemCount = parseInt(input)
        this.addSubtask(1, 500.00, itemCount, [])
      }
      this.dialogCreateVisible = false
      this.createInput = ''
    },
    handleCheck(input) {
      if (input.length > 0) {
        let itemCount = parseInt(input)
        this.addSubtask(3, 500.00, itemCount, [])
      }
      this.dialogCheckVisible = false
      this.checkInput = ''
    },
    handlePreview(row) {
      this.selectTable = row
      this.drawerFlag = true
    },
    handleClose() {
      this.drawerFlag = false
    },
    handleUndo(index, row) {
      // console.log('撤销 index: ', index)
      this.subtaskTableData.splice(index, 1)
      if (row.type === 2) {
        for (let id in row.itemTable) {
          this.disableItemTable.splice(this.disableItemTable.indexOf(id), 1)
        }
      }
    },
    handleAssignConfirm() {
      if (this.subtaskTableData.length <= 0) {
        console.log('任务列表为空，发布失败')
        return
      }

      let msg = JSON.stringify({
        task_id: this.task_id,
        token: this.user_token,
        subtask: this.subtaskTableData
      })
      this.$axios
        .post('/api/taskSplit', msg)
        .then(res => {
          console.log('发布任务成功', msg)
          this.displayMessage('success', '发布任务成功')
          this.subtaskTableData = []
        })
        .catch(error => {
          console.log('发布失败，请重新发布！', error)
          this.$message.error('发布失败，请重新发布！')
        })
    },
    handleLeftSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.leftCurrentPage = 1
      this.pageSize = val
    },
    // 当前页改变时触发 跳转其他页
    handleLeftCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.leftCurrentPage = val
    },
    displayMessage(type, msg) {
      this.$message({
        message: msg,
        type: type
      })
    }
  },
  computed: {
    selectedCount() {
      let totalCount = 0
      this.multipleSelection.forEach(item => {
        totalCount += 1
      })
      return totalCount
    }
  }
}
</script>

<style>
.head {
  height: 50px;
  width: 100%;
  text-align: center;
}

.container {
  position: absolute;
  width: 100%;
  display: flex;
  top: 50px;
  bottom: 100px;
}

.left-group, .right-group {
  width: 40%;
  /*background-color: #7ecff2;*/
  text-align: center;
}

.mid-group {
  flex: 1;
  /*background-color: #ff5000;*/
  text-align: center;

}
.mid-button-center {
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.mid-button-bottom {
  align-items: center;

  position: absolute;
  bottom: 0px;
}

.foot {
  position: absolute;
  width: 100%;
  height: 100px;
  bottom: 0;
  /*background-color: purple;*/
  text-align: center;
}
</style>
