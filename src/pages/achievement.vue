<template>
  <div style="top: 0px">
    <p style="font-size: 20px; text-align: center">专题成果展示</p>

    <div class="head">
      <el-card>
        <div slot="header" align="center">
          <span>专题信息</span>
        </div>

        <el-form label-position="left" inline class="task-card">
          <el-form-item label="专题ID">
            <span>{{ task.task_id }}</span>
          </el-form-item>
          <el-form-item label="专题名称">
            <span>{{ task.name }}</span>
          </el-form-item>
          <el-form-item label="专题领域">
            <span>{{ task.field.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>
          <el-form-item label="专题酬劳">
            <span>{{ task.reward }}</span>
          </el-form-item>
          <el-form-item label="专题描述">
            <span>{{ task.description.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>

          <el-form-item label="专题内容">
            <span>{{ task.document.toString().replace('[', '').replace(']', '') }}</span>
          </el-form-item>
          <el-form-item label="关联资源">
            <vue-qr v-if="task.isli_code!=''" :text="task.isli_code" :logoSrc="isliLogoPath"></vue-qr>
            <span v-else>未关联资源</span>
          </el-form-item>
        </el-form>
        <!--        <el-progress :text-inside="true" :stroke-width="26" :percentage=this.task_rate.toString()></el-progress>-->
      </el-card>
      <br/><br/>
      <el-divider></el-divider>

      <el-row>
        <el-col :span="18">
          <!--          <el-progress type="circle" :percentage="25"></el-progress>-->
          <span>专题进度</span>
          <el-progress :text-inside="true" :stroke-width="24" :percentage=this.task_rate></el-progress>
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="primary" icon="el-icon-paperclip" @click="ISLIConnect">ISLI资源关联</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="taskCommit">结果提交</el-button>
        </el-col>
      </el-row>
      <el-divider>专题词条表</el-divider>
      <el-table
        ref="multipleTable"
        :data="tableData.slice((leftCurrentPage-1)*pageSize,leftCurrentPage*pageSize)"
        tooltip-effect="dark"
        row-key="item_id"
        style="width: 100%"
        @selection-change="handleSelectionChange">

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

      <entryReview :form="selectTable" :drawerFlag="drawerFlag" v-on:handleClose="handleClose"></entryReview>

    </div>

  </div>
</template>

<script>
import entryReview from '../components/entryReview'
import viewTable from '../components/viewTable'
import vueQr from 'vue-qr'

export default {
  name: 'achievement',
  inject: ['reload'],
  components: {
    entryReview,
    viewTable,
    vueQr
  },
  data() {
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

      dataNum: 0,
      task: {
        description: '',
        document: '',
        field: [],
        hasInitialize: 0,
        name: '',
        resultFileType: '',
        reward: '',
        task_id: 1,
        isli_code: ''
      },
      task_rate: 0,
      isliLogoPath: require('@/assets/isliLogo.jpg')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (JSON.stringify(this.$route.query) == '{}') {
        this.task_id = 0
        this.token = ''
        // this.user_id = 0
        // this.fbzId = 0
      } else {
        this.task_id = this.$route.query.taskId
        this.token = this.$route.query.token
        // this.user_id = this.$route.query.userId
        // this.fbzId = this.$route.query.fbzId
      }

      let msg = JSON.stringify({token: this.token})
      console.log('任务划分登录-请求后台校验：', msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/userLogin', msg)
        .then(res => {
          console.log('token校验结果：', res)
          this.inToken = res.data.data.inside_token
          console.log(this.inToken)
          window.sessionStorage.setItem('token', this.inToken)

          this.getTaskData()
        })
        .catch(error => {
          console.log('用户校验失败：', error)
          this.$message.error('用户权限校验失败')
        })
    },

    getTaskData() {
      let msg = JSON.stringify({task_id: this.task_id})
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/getTaskShowInfo', msg)
        .then(res => {
          this.task = res.data.data.task
          this.task_rate = res.data.data.task_rate
          this.tableData = res.data.data.items
        })
        .catch(error => {
          console.log('请求专题信息失败：', error)
          this.$message.error('专题成果请求失败')
        })
    },
    ISLIConnect() {
      let url = 'http://www.izhihui.net/relation?taskId=' + String(this.task_id) + '&type=2'
      console.log('跳转url：', url)
      this.$message.success('跳转至ISLI关联页面')
      window.location.href = url
    },
    taskCommit() {
      let msg = JSON.stringify({taskId: this.task_id})
      this.$axios
        .post(this.serverUrl + '/api/entry/finishWork', msg)
        .then(res => {
          console.log('结果提交成功:', res)
          this.$message.success('结果提交成功')
        })
        .catch(error => {
          console.log('结果提交失败：', error)
          this.$message.error('结果提交失败')
        })
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
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
    handleClose() {
      this.drawerFlag = false
    },
    handleFieldTable(row, column) {
      let tmp = row.field
      return tmp.join()
    },
    handlePreview(row) {
      this.selectTable = row
      this.drawerFlag = true
    },
    valid_isli_code() {
      console.log(this.task)
      console.log(this.task.isli_code)
      if (JSON.stringify(this.task.isli_code) == '{}') {
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.container-introduction {

  width: 50%;
}

.container-picture {

  width: 50%;
}
</style>
