<template>
  <div>

    <el-header style="color:#409EFF;font-size: 30px;text-align: center">审核人员页面</el-header>
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
            <el-form-item label="子任务ID">
              <span>{{ props.row.subtaskId }}</span>
            </el-form-item>
            <el-form-item label="子任务奖励">
              <span>{{ props.row.subtaskAward }}</span>
            </el-form-item>

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
        prop="itemField">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="itemStatus">
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handlePreview(scope.row)">预览
          </el-button>
          <el-button
            size="mini"
            @click="handleReceive(scope.row.item_id)">通过
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleRefuse(scope.row.item_id)">拒绝
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <entryReview :form="selectTable" :drawerFlag="drawerFlag" v-on:handleClose="handleClose"></entryReview>
  </div>
</template>

<script>
import entryReview from '../components/entryReview'

export default {
  name: 'check',
  inject: ['reload'],
  components: {
    entryReview
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      serverUrl: 'http://101.200.34.92:8081',
      user_id: 0,
      user_token: '',
      task_id: 0,
      tableData: [],
      selectTable: {},
      drawerFlag: false

    }
  },
  methods: {
    init: function () {
      console.log('审核页面: ', this.$route)
      // 调用接口初始化

      // 信息初始化，如果前一个页面没有传入参数信息，则读取sessionStorage来设置参数
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
      this.getDataByTaskId()
    },
    getDataByTaskId: function () {
      // POST需要的task_id到后端，得到返回的所有信息
      let msg = JSON.stringify({task_id: this.task_id})
      console.log('审核人员查询专题信息: ', msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/getCheckItem', msg)
        .then(res => {
          console.log('词条搜索结束')
          console.log(res)
          this.tableData = res.data.data
        })
    },
    handlePreview(row) {
      this.selectTable = row
      this.drawerFlag = true
    },
    handleClose() {
      this.drawerFlag = false
    },

    handleReceive(itemId) {
      // 修改词条状态
      let msg = JSON.stringify({
        task_id: this.task_id,
        item_id: itemId,
        checkResult: 1,
        user_id: this.user_id,
        content: ''
      })
      console.log('提交审核：', msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/updateCheckItem', msg)
        .then(res => {
          console.log('审核词条结果：通过')
          console.log(res)
          this.reload()
        })
        .catch(error => {
          console.log('审核词条异常: ',error)
          this.reload()
        })


    },
    handleRefuse(itemId) {
      // 是否需要输入未通过审核的原因，不需要的话则和handleReceive合并
      let msg = JSON.stringify({
        task_id: this.task_id,
        item_id: itemId,
        checkResult: 0,
        user_id: this.user_id,
        content: ''
      })
      console.log('提交审核：', msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/updateCheckItem', msg)
        .then(res => {
          console.log('审核词条结果：未通过')
          console.log(res)
          this.reload()
        })
        .catch(error => {
          console.log('审核词条异常: ',error)
          this.reload()
        })
    },
    displayMessage(type, msg) {
      this.$message({
        message: msg,
        type: type
      })
    }

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
