<template>
  <div style="top: 0px">

    <div class="head">
      <p style="font-size: 20px; text-align: center">划分任务页面</p>
      <span style="font-family: 'Arial Black'">专题信息</span>
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="专题ID">
          <span>{{ this.task.task_id }}</span>
        </el-form-item>
        <el-form-item label="专题名称">
          <span>{{ this.task.name }}</span>
        </el-form-item>
        <el-form-item label="专题领域">
        <span>{{ this.task.field.toString().replace('[','').replace(']','')}}</span>
        </el-form-item>
        <el-form-item label="专题酬劳">
          <span>{{ this.task.reward }}</span>
        </el-form-item>
        <el-form-item label="专题描述">
          <span>{{ this.task.description }}</span>
        </el-form-item>

        <el-form-item label="专题内容">
          <span>{{ this.task.document }}</span>
        </el-form-item>
      </el-form>
<!--      <ul>-->
<!--        <li>-->
<!--          <span>姓名：</span><span>{{this.task.task_id}}</span>-->
<!--        </li>-->
<!--        <li>-->
<!--          <span>注册时间：</span><span>{{adminInfo.create_time}}</span>-->
<!--        </li>-->
<!--        <li>-->
<!--          <span>管理员权限：</span><span>{{adminInfo.admin}}</span>-->
<!--        </li>-->
<!--        <li>-->
<!--          <span>管理员 ID：</span><span>{{adminInfo.id}}</span>-->
<!--        </li>-->
<!--        </ul>-->
<br/>
      <br/>
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

          <!--          <el-input v-model="checkInput" placeholder="请输入审核人员数"></el-input>-->
          <div v-for="(item,index) in arrayData" :key="item.id">
            <el-input
              type="input"
              placeholder="请填写需审核词条数"
              v-model="item.data"
            >
              <el-button type="danger"
                         slot="append"
                         class="el-icon-remove-outline"
                         :style="{color:'red'}"
                         @click="deleteChecker(item,index)"></el-button>
            </el-input>

          </div>
          <el-button type="primary" @click="addChecker">添加审核人员</el-button>

          <span slot="footer" class="dialog-footer">
            <p>总词条数：{{ this.create_item_cnt + this.init_item_cnt }}条</p>
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
                    <span>{{ scope.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="任务描述">
                    <span>{{ scope.row.content }}</span>
                  </el-form-item>
                  <el-form-item label="词条数" v-show="scope.row.type !== 3">
                    <span>{{ scope.row.itemCount }}</span>
                  </el-form-item>
                  <el-form-item label="人员数" v-show="scope.row.type === 3">
                    <span>{{ scope.row.itemCount }}</span>
                  </el-form-item>
                  <el-form-item label="id列表" v-show="scope.row.type === 2">
                    <span>{{ scope.row.itemTable }}</span>
                  </el-form-item>
                  <el-form-item label="任务金额">
                    <span>{{ scope.row.money }}</span>
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
      serverUrl: 'http://101.200.34.92:8081',
      task_id: 0,
      user_id: 0,
      user_token: '',
      inToken: '',
      fbzId: 99,

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
      checkInput: '',

      // 审核词条数=所有词条数=初始化+待新建
      init_item_cnt: 0, // 初始化的词条数量
      create_item_cnt: 0, // 需要新建的词条数量


      arrayData: [
        {
          id: '1',
          data: ''
        }
      ],
      dataNum: 0,
      task: {
        description:'',
        document:'',
        field:[],
        hasInitialize:0,
        name:'',
        resultFileType:'',
        reward:'',
        task_id:1
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 调用获取
      // this.tableData = []


      console.log('assignTask传入参数：', this.$route)


      if (JSON.stringify(this.$route.query) == '{}') {
        console.log('读取session信息')
        let loginData = JSON.parse(window.sessionStorage.getItem('user'))
        this.user_id = loginData.user_id
        this.user_token = loginData.user_token
        this.task_id = loginData.task_id
        this.fbzId = loginData.fbzId
      } else {
        this.user_id = this.$route.query.user_id
        this.user_token = this.$route.query.user_token
        this.task_id = this.$route.query.task_id
        this.fbzId = this.$route.query.fbzId
        let loginData = JSON.stringify({
          user_id: this.user_id,
          task_id: this.task_id,
          user_token: this.user_token,
          fbzId: this.fbzId
        })
        window.sessionStorage.setItem('user', loginData)
      }

      this.inToken = window.sessionStorage.getItem('token')

      if (this.inToken.length <= 0) {
        let msg = JSON.stringify({token: this.user_token})
        this.$axios
          .post(this.serverUrl + '/inside_api/entry/userLogin', msg)
          .then(res => {
            console.log('token校验结果：', res)
            this.inToken = res.data.data.inside_token
            window.sessionStorage.setItem('token', this.inToken)
            this.getInitItems() // 需要改成从后端获取数据
          })
          .catch(error => {
            console.log('用户校验失败：', error)
            this.$message.error('用户校验失败')
            this.inToken = ''
          })
      } else {
        this.getInitItems() // 需要改成从后端获取数据
      }


    },
    deleteChecker(item, index) {
      if (this.arrayData.length <= 1) { // 如果只有一个输入框则不可以删除
        return false
      }
      this.arrayData.splice(index, 1)// 删除了数组中对应的数据也就将这个位置的输入框删除
    },
    addChecker(item) {
      this.arrayData.push(// 增加就push进数组一个新值
        {
          id: this.dataNum++,
          data: ''
        }
      )
    },
    getInitItems() {
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/assignTask', JSON.stringify({
          taskId: this.task_id
        }))
        .then(res => {
          console.log('后端返回的回复：', res)
          res.data.data.items.forEach(item => {
            this.tableData.push(item)
          })
          this.init_item_cnt = this.tableData.length
          this.task=res.data.data.task
          console.log('收到的后端task信息：',this.task)
        })
        .catch(error => {
          console.log(error)
          this.$message.error('获取初始化词条失败')
        })

    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
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
        this.create_item_cnt += itemCount//////////////////////////////////////////////
        this.addSubtask(1, 500.00, itemCount, [])
      }
      this.dialogCreateVisible = false
      this.createInput = ''
    },
    handleCheck(input) {
      let checkCnt = 0
      let checkArray = []
      this.arrayData.forEach(item => {
        checkArray.push(parseInt(item.data))
        checkCnt += parseInt(item.data)
      })

      if (checkArray.length > 0) {
        if (checkCnt != this.init_item_cnt + this.create_item_cnt) {
          this.$message.warning('请确保总审核词条数和总词条数一致')
          return
        }
        this.addSubtask(3, 500.00, checkArray.length, checkArray)
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

      if (row.type === 1) { // 新建任务
        this.create_item_cnt -= row.itemCount
      }

      if (row.type === 2) { // 完善任务，撤销后需要将初始化的词条前面的禁止勾选取消
        for (let id in row.itemTable) {
          this.disableItemTable.splice(this.disableItemTable.indexOf(id), 1)
        }
      }
    },
    handleAssignConfirm() {
      if (this.subtaskTableData.length <= 0) {
        console.log('任务列表为空，发布失败')
        this.$message.warning('任务列表为空，发布失败')
        return
      }

      let msg = JSON.stringify({
        task_id: this.task_id,
        subtask: this.subtaskTableData,
        inside_token: window.sessionStorage.getItem('token'),
        fbzId: this.fbzId
      })

      console.log('传入信息：', msg)
      console.log('当前token：', this.user_token)

      this.$axios
        .post(this.serverUrl + '/inside_api/entry/taskSplit', msg)
        .then(res => {
            console.log('发布任务成功', msg)
            this.displayMessage('success', '发布任务成功')
            this.subtaskTableData = []


            // this.$router.push(
            //   {
            //     path: '113.207.56.4/taskDetail',
            //     query: {
            //       id: this.task_id,
            //       type: 2,
            //       token: this.user_token
            //     }
            //   }
            // )
            let url = 'http://113.207.56.4/taskDetail' + '?id=' + String(this.user_id) + '&type=2&token=' + String(this.user_token)
            console.log('跳转url：', url)
            window.location.href = url

          }
        )
        .catch(error => {
          console.log('发布失败，请重新发布！', error)
          this.$message.error('发布失败，请重新发布！')
        })

    },
    handleLeftSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.leftCurrentPage = 1
      this.pageSize = val
    }
    ,
// 当前页改变时触发 跳转其他页
    handleLeftCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.leftCurrentPage = val
    }
    ,
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
  flex:1;
  width: 100%;
}

.container {
  position: absolute;
  width: 100%;
  display: flex;
  flex: 1;
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
  top: 50%;
  transform: translate(-50%, -50%);
}

.mid-button-bottom {
  /*align-items: center;*/

  /*position: absolute;*/
  /*bottom: 0px;*/
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
}

.foot {
  position: absolute;
  width: 100%;
  height: 100px;
  bottom: 0;
  /*background-color: purple;*/
  text-align: center;
}
.demo-table-expand {
  font-size: 0;

}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item{
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

</style>
