<template>
  <div>

    <el-header style="color:#409EFF;font-size: 30px;text-align: center">编辑人员页面</el-header>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="词条ID">
              <span>{{ props.row.item_id }}</span>
            </el-form-item>
            <el-form-item label="词条名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属领域">
              <span>{{ props.row.field }}</span>
            </el-form-item>
            <el-form-item label="词条状态">
              <span>{{ statusTable[props.row.status] }}</span>
            </el-form-item>
            <!--            <el-form-item label="子任务奖励">-->
            <!--              <span>{{ props.row.subtaskAward }}</span>-->
            <!--            </el-form-item>-->

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="词条ID"
        prop="item_id">
      </el-table-column>
      <el-table-column
        label="词条名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="所属领域"
        prop="field">
      </el-table-column>
      <el-table-column
        label="状态值"
        prop="status">
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!(scope.row.status === 0 || scope.row.status === 2 || scope.row.status === 4)"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            @click="handlePreview(scope.row)">预览
          </el-button>
          <el-button v-if="scope.row.status != 3"
                     size="mini"
                     type="primary"
                     @click="handleSubmit(scope.row)">提交审核
          </el-button>
          <el-button v-else
                     size="mini"
                     type="primary"
                     :disabled="true">正在审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center">
      <br/>
      <br/>
      <el-button type="info" @click="jumpToIZhihui" round>前往智荟网</el-button>
    </div>

    <entryReview :form="selectTable" :drawerFlag="drawerFlag" v-on:handleClose="handleClose"></entryReview>
  </div>

</template>

<script>
import entryReview from '../components/entryReview'

export default {
  name: 'edit',
  inject: ['reload'],
  components: {
    entryReview
  },
  data() {
    return {
      serverUrl: 'http://101.200.34.92:8081',
      user_id: 0,
      user_token: '',
      task_id: 0,
      statusTable: ['空词条', '初始化', '待完善', '待审核', '待重新完善', '已审核'],
      tableData: [],
      selectTable: {},

      drawerFlag: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log('跳转信息: ', this.$route)
      // 调用接口初始化

      if (JSON.stringify(this.$route.query) == '{}') {
        console.log('读取session信息')
        let loginData = JSON.parse(window.sessionStorage.getItem('user'))
        this.user_id = loginData.user_id
        this.user_token = loginData.user_token
        this.task_id = loginData.task_id
      } else {
        this.user_id = this.$route.query.user_id
        this.user_token = this.$route.query.user_token
        this.task_id = this.$route.query.task_id
        let loginData = JSON.stringify({user_id: this.user_id, task_id: this.task_id, user_token: this.user_token})
        window.sessionStorage.setItem('user', loginData)
      }

      let msg = JSON.stringify({user_id: this.user_id, task_id: this.task_id})
      console.log('登录信息: ', msg)

      this.$axios
        .post(this.serverUrl + '/inside_api/entry/searchUserId', msg)
        .then(res => {
          console.log('词条搜索结束')
          console.log(res)
          // this.tableData = res.data.data

          this.tableData = res.data.data

          // for (let i in res.data.data) {
          //   let item = res.data.data[i]
          //   console.log('item: ', item)
          //   let tmp = {}
          //   tmp.item_id = item.item_id
          //   tmp.task_id = item.task_id
          //   tmp.original_id = item.original_id
          //   tmp.name = item.name
          //   tmp.field = item.field
          //   tmp.imageUrl = item.imageUrl
          //   tmp.intro = item.intro
          //   tmp.info_box = item.info_box
          //   tmp.content = item.content
          //   //  tmp.reference
          //   tmp.relation = item.relation
          //   tmp.status = item.status
          //   tmp.reference = item.reference
          //
          //   this.tableData.push(tmp)
          // }
        })
    },
    sendData: function () {
      // 将新的词条信息传回后端，需要包含词条的所有属性，UserId，SubtaskId？

    },
    handleEdit: function (row) {
      this.selectTable = row
      console.log('准备编辑：', row)
      window.sessionStorage.setItem('item', JSON.stringify(this.selectTable))
      this.$router.push({
        path: '/editor',
        // query: this.selectTable
        query: {
          user_id: this.user_id,
          user_token: this.user_token,
          task_id: this.task_id,
          data: this.selectTable
        }
      })
    },
    handleSubmit(row) {
      this.selectTable = row
      this.selectTable.operation = 1
      let msg = JSON.stringify(this.selectTable)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/updateEditItem', msg)
        .then(res => {
          console.log('完善词条提交审核')
          console.log(res)
          this.$message.success('提交审核成功')
          this.reload()
        })
        .catch(error => {
          console.log('提交失败')
          console.log(error)
          this.$message.error('提交审核失败')
          this.reload()
        })
    },
    handlePreview(row) {
      this.selectTable = row
      this.drawerFlag = true
    },
    handleClose() {
      this.drawerFlag = false
    },
    jumpToIZhihui() {
      window.location.href = 'http://izhihui.net/'
    }
    // handleTest (row) {
    //   row.status=2
    // }

  }

}
</script>

<style>

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.table_container {
  padding: 20px;
}

.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
