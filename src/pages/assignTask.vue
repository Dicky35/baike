<template>
  <div style="top: 0px">
    <p style="font-size: 20px; text-align: center">划分任务页面</p>

    <div class="head">
      <el-card>
        <div slot="header" align="center">
          <span>专题信息</span>
        </div>

        <el-form label-position="left" inline class="task-card">
          <el-form-item label="专题ID">
            <span>{{ this.task.task_id }}</span>
          </el-form-item>
          <el-form-item label="专题名称">
            <span>{{ this.task.name }}</span>
          </el-form-item>
          <el-form-item label="专题领域">
            <span>{{ this.task.field.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>
          <el-form-item label="专题酬劳">
            <span>{{ parseFloat(this.task.reward).toFixed(2) }}</span>
          </el-form-item>
          <el-form-item label="专题描述">
            <span>{{ this.task.description.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>

          <el-form-item label="专题内容">
            <span>{{ this.task.document.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>
        </el-form>

      </el-card>
      <br/><br/>
      <el-divider>初始化词条表</el-divider>
      <viewTable>
        <!-- 左按钮区 -->
        <template slot="left-field">
          <el-button>已选择:{{ selectedCount }}条</el-button>
        </template>
        <!-- 搜索框 -->
        <template slot="search-field">
          <!--          <span>已分配酬劳</span>-->
          <!--          <el-progress :text-inside="true" :stroke-width="26" :percentage="70" show-text>已分配酬劳</el-progress>-->
          <el-button>剩余酬劳:{{ money.toFixed(2) }}</el-button>
        </template>
        <!-- 过滤条件区 -->

        <template slot="filter-field">

          <el-form :inline="true" :hide-required-asterisk="true" :model="completeForm" :rules="rules" ref="completeForm"
                   label-width="150px">
            <el-form-item label="完善任务金额" prop="price">
              <el-input v-model="completeForm.price" clearable oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入完善任务金额"/>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-edit" @click="handleComplete('completeForm')">完善词条</el-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 右按钮区 -->
        <template slot="right-field">
          <el-button type="primary" icon="el-icon-document-add" @click="dialogCreateVisible=true">新建词条</el-button>
          <el-button type="success" icon="el-icon-finished" :disabled="checkButtonAvailable"
                     @click="dialogCheckVisible=true">审核词条
          </el-button>
        </template>
        <!-- 表格区 -->
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
            min-width
            align="center">
          </el-table-column>
          <el-table-column
            prop="item_id"
            label="ID"
            align="center"
            min-width>
          </el-table-column>
          <el-table-column
            prop="name"
            label="词条名"
            align="center"
            min-width>
          </el-table-column>
          <el-table-column
            prop="field"
            label="领域"
            align="center"
            :formatter="handleFieldTable"
            min-width>
          </el-table-column>

          <el-table-column
            prop="intro"
            label="简介"
            align="center"
            show-overflow-tooltip
            min-width>
          </el-table-column>

          <el-table-column label="操作" min-width align="center">
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
      </viewTable>
      <entryReview :form="selectTable" :drawerFlag="drawerFlag" v-on:handleClose="handleClose"></entryReview>

      <br/><br/>
      <el-divider>待发布任务列表</el-divider>

      <viewTable>
        <!-- 左按钮区 -->
        <template slot="left-field">
          <p></p>
          <!--          <el-button type="danger" icon="el-icon-circle-plus-outline">添加</el-button>-->
        </template>
        <!-- 搜索框 -->
        <p></p>
        <template slot="search-field">
          <p></p>
          <!--          <el-input suffix-icon="el-icon-search" placeholder="请输入搜索内容"></el-input>-->
        </template>
        <!-- 过滤条件区 -->
        <template slot="filter-field">
          <p></p>
          <!--                  <el-select v-model="filterType" placeholder="选择类型"></el-select>-->
          <!--                  <el-date-picker type="daterange" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>-->
        </template>
        <!-- 右按钮区 -->
        <template slot="right-field">
          <el-button type="danger" icon="el-icon-delete" @click="handleClear()">清空任务</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="handleAssignConfirm()">发布任务</el-button>
        </template>
        <!-- 表格区 -->
        <el-table
          :data="subtaskTableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="任务类型"
            align="center"
            min-width>
          </el-table-column>
          <el-table-column
            prop="content"
            label="任务描述"
            align="center"
            min-width>
          </el-table-column>
          <el-table-column
            prop="itemCount"
            label="词条/人员数"
            align="center"
            min-width>
          </el-table-column>
          <el-table-column
            prop="money"
            label="任务金额"
            align="center"
            min-width>
          </el-table-column>

          <el-table-column label="操作" align="center" min-width>
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                width="500"
                trigger="hover">
                <el-form :model="scope.row" label-width="400px">
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
                    <span>{{ scope.row.money.toFixed(2) }}</span>
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

      </viewTable>
    </div>

    <el-dialog
      title="新建词条"
      :visible.sync="dialogCreateVisible"
      width="50%">
      <el-form :model="createForm" :rules="rules" ref="createForm">
        <el-form-item label="任务金额" prop="price">
          <el-input v-model="createForm.price" clearable oninput="value=value.replace(/[^0-9.]/g,'')"
                    placeholder="请输入任务金额"/>
        </el-form-item>
        <el-form-item label="新建词条数" prop="create">
          <el-input v-model="createForm.create" clearable oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入新建词条数"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
            <p>剩余酬劳:{{ money.toFixed(2) }}</p>
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCreate('createForm')">发 布</el-button>
          </span>
    </el-dialog>

    <el-dialog
      title="审核词条"
      :visible.sync="dialogCheckVisible"
      width="50%">

      <el-form :model="checkForm" :rules="rules" ref="checkForm" label-width="100px">
        <el-form-item label="任务金额" prop="price">
          <el-input v-model="checkForm.price" clearable oninput="value=value.replace(/[^0-9.]/g,'')"
                    placeholder="请输入任务金额"/>
        </el-form-item>

        <el-form-item v-for="(item,index) in checkForm.persons" :label="'审核人员'+index" :key="item.id"
                      :rules="rules.data"
                      :prop="'persons.'+index+'.data'">
          <el-input
            type="input"
            placeholder="请填写需审核词条数"
            v-model="item.data"
            oninput="value=value.replace(/[^0-9]/g,'')">
            <el-button type="danger"
                       slot="append"
                       class="el-icon-remove-outline"
                       :style="{color:'red'}"
                       @click="deleteChecker(item,index)"></el-button>
          </el-input>
        </el-form-item>

      </el-form>

      <el-button type="primary" @click="addChecker">添加审核人员</el-button>

      <span slot="footer" class="dialog-footer">
            <p>剩余酬劳:{{ money.toFixed(2) }}</p>
            <p>已分配词条：{{ checkItemCount }}</p>
            <p>总词条数：{{ this.create_item_cnt + this.init_item_cnt }}条</p>
            <el-button @click="dialogCheckVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCheck('checkForm')">发 布</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import entryReview from '../components/entryReview'
import viewTable from '../components/viewTable'

export default {
  name: 'assignTask',
  inject: ['reload'],
  components: {
    entryReview,
    viewTable
  },
  data() {
    const validateReward = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else if (value.indexOf('.') != -1 && value.split('.').length > 2) {
        callback(new Error('请输入正确格式的金额')) // 防止输入多个小数点
      } else if (value.indexOf('.') != -1 && value.split('.')[1].length > 2) {
        callback(new Error('请输入正确的小数位数')) // 小数点后两位
      } else if (parseFloat(value) > this.money) {
        callback(new Error('任务金额超过上限'))
      } else {
        callback()
      }
    }
    return {
      serverUrl: 'http://101.200.34.92:8081',
      task_id: 0,
      user_id: 0,
      user_token: '',
      inToken: '',
      fbzId: 99,

      money: 0.0,

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

      checkButtonAvailable: false, // 只能发布一个审核任务

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
        description: '',
        document: '',
        field: [],
        hasInitialize: 0,
        name: '',
        resultFileType: '',
        reward: '',
        task_id: 1
      },

      createForm: {
        create: '',
        price: ''
      },
      completeForm: {
        price: ''
      },
      checkForm: {
        persons: [
          {
            id: '1',
            data: ''
          }
        ],
        price: ''
      },
      rules: {
        price: [
          {type: 'string', required: true, trigger: 'blur', validator: validateReward}
        ],
        create: [
          {required: true, type: 'string', trigger: 'blur', message: '词条数不能为空'}
        ],
        data: [
          {required: true, type: 'string', trigger: 'blur', message: '词条数不能为空'}
        ]
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
      // if (this.arrayData.length <= 1) { // 如果只有一个输入框则不可以删除
      //   return false
      // }
      // this.arrayData.splice(index, 1)// 删除了数组中对应的数据也就将这个位置的输入框删除

      if (this.checkForm.persons.length <= 1) { // 如果只有一个输入框则不可以删除
        this.$message.warning('至少需要一个审核人员')
        return false
      }
      this.checkForm.persons.splice(index, 1)// 删除了数组中对应的数据也就将这个位置的输入框删除
    },
    addChecker(item) {
      this.checkForm.persons.push(// 增加就push进数组一个新值
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
          this.task = res.data.data.task
          this.money = parseFloat(this.task.reward)
          console.log('收到的后端task信息：', this.task)
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

      if (type == 3) {
        this.subtaskTableData.push({
          name: typeName + '词条',
          content: typeName + (this.create_item_cnt + this.init_item_cnt).toString() + '条词条',
          type: type,
          money: money,
          itemCount: itemCount,
          itemTable: itemTable
        })
      } else {
        this.subtaskTableData.push({
          name: typeName + '词条',
          content: typeName + itemCount.toString() + '条词条',
          type: type,
          money: money,
          itemCount: itemCount,
          itemTable: itemTable
        })
      }
    },
    handleComplete(formName) {
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let price = parseFloat(this.completeForm.price)
          this.addSubtask(2, price, selectedItemTable.length, selectedItemTable)
          this.toggleSelection(selectedTable)
        } else {
          this.$message.error('任务添加失败，请确保输入的完善任务金额正确')
          return false
        }
      })
    },
    handleCreate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let itemCount = parseInt(this.createForm.create)
          let price = parseFloat(this.createForm.price)
          this.create_item_cnt += itemCount/// ///////////////////////////////////////////
          this.money -= price
          this.addSubtask(1, price, itemCount, [])
          this.$message.success('任务添加成功')
          this.dialogCreateVisible = false
          this.$refs[formName].resetFields()
        } else {
          this.$message.error('任务添加失败，请确保输入正确')
          return false
        }
      })
    },
    handleCheck(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let checkCnt = 0
          let checkArray = []
          this.checkForm.persons.forEach(item => {
            checkArray.push(parseInt(item.data))
            checkCnt += parseInt(item.data)
          })

          if (checkArray.length > 0) {
            if (checkCnt != this.init_item_cnt + this.create_item_cnt) {
              this.$message.warning('请确保总审核词条数和总词条数一致')
              return
            }
            let price = parseFloat(this.checkForm.price)
            this.money -= price
            this.addSubtask(3, price, checkArray.length, checkArray)
          }

          this.$message.success('任务添加成功')
          this.dialogCheckVisible = false
          this.checkButtonAvailable = true
          this.$refs[formName].resetFields()
        } else {
          this.$message.error('任务添加失败，请确保输入正确')
          return false
        }
      })

      // let checkCnt = 0
      // let checkArray = []
      // this.arrayData.forEach(item => {
      //   checkArray.push(parseInt(item.data))
      //   checkCnt += parseInt(item.data)
      // })
      //
      // if (checkArray.length > 0) {
      //   if (checkCnt != this.init_item_cnt + this.create_item_cnt) {
      //     this.$message.warning('请确保总审核词条数和总词条数一致')
      //     return
      //   }
      //   this.addSubtask(3, 500.00, checkArray.length, checkArray)
      // }
      // this.dialogCheckVisible = false
      // this.checkInput = ''
    },
    handlePreview(row) {
      this.selectTable = row
      this.drawerFlag = true
    },
    handleClose() {
      this.drawerFlag = false
    },
    handleClear() {
      this.subtaskTableData.forEach(item => {
        if (item.type === 1) { // 新建任务
          this.create_item_cnt -= item.itemCount
        } else if (item.type === 2) { // 完善任务，撤销后需要将初始化的词条前面的禁止勾选取消
          for (let id in item.itemTable) {
            this.disableItemTable.splice(this.disableItemTable.indexOf(id), 1)
          }
        } else if (item.type === 3) { // 审核任务，撤销后需要恢复 审核按钮 的可用性
          this.checkButtonAvailable = false
        }
        this.money += item.money
      })
      this.subtaskTableData = []
    },
    handleUndo(index, row) {
      // console.log('撤销 index: ', index)
      this.subtaskTableData.splice(index, 1)

      if (row.type === 1) { // 新建任务
        this.create_item_cnt -= row.itemCount
      } else if (row.type === 2) { // 完善任务，撤销后需要将初始化的词条前面的禁止勾选取消
        for (let id in row.itemTable) {
          this.disableItemTable.splice(this.disableItemTable.indexOf(id), 1)
        }
      } else if (row.type === 3) { // 审核任务，撤销后需要恢复 审核按钮 的可用性
        this.checkButtonAvailable = false
      }
      this.money += row.money
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
        outside_token: this.user_token,
        fbzId: this.fbzId
      })

      console.log('传入信息：', msg)
      console.log('当前token：', this.user_token)

      this.$axios
        .post(this.serverUrl + '/inside_api/entry/taskSplit', msg)
        .then(res => {
            console.log('发布任务成功', res)
            this.displayMessage('success', '发布任务成功')
            this.subtaskTableData = []

            let url = 'http://izhihui.net/taskDetail' + '?id=' + String(this.user_id) + '&type=2&token=' + String(this.user_token)
            console.log('跳转url：', url)
            this.$message.success('跳转至任务详情页面')
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
    },
    handleFieldTable(row, column) {
      let tmp = row.field
      return tmp.join()
    }
  },
  computed: {
    selectedCount() {
      let totalCount = 0
      this.multipleSelection.forEach(item => {
        totalCount += 1
      })
      return totalCount
    },
    checkItemCount() {
      let totalCount = 0
      this.checkForm.persons.forEach(item => {
        if (item.data.length <= 0) {
          return
        }
        totalCount += parseInt(item.data)
      })
      return totalCount
    }
  }
}
</script>

<style>
.head {
  flex: 1;
  width: 100%;
}

.foot {
  position: absolute;
  width: 100%;
  height: 100px;
  bottom: 0;
  /*background-color: purple;*/
  text-align: center;
}

.task-card {
  font-size: 0;

}

.task-card label {
  width: 90px;
  color: #99a9bf;
}

.task-card .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

</style>
