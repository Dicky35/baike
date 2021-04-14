<template>
  <div>
    <el-input placeholder="请输入" v-model="user_id">
      <template slot="prepend">用户ID</template>
    </el-input>

    <el-input placeholder="请输入" v-model="user_token">
      <template slot="prepend">用户Token</template>
    </el-input>

    <el-input placeholder="请输入" v-model="task_id">
      <template slot="prepend">专题Id</template>
    </el-input>

    <el-button type='primary'  @click="editPage(user_id,user_token,task_id)"> 编辑 </el-button>
    <el-button type='primary' @click="checkPage(user_id,user_token,task_id)">审核</el-button>
    <el-button type="primary" @click="handleAssign(user_id,user_token,task_id)">任务划分</el-button>

    <el-button type="primary" @click="handleEditor">词条编辑</el-button>

    <p></p>
    <el-button type="primary" @click="sendMessage(user_id,user_token)">searchUserId</el-button>
    <el-button type="primary" @click="updateEditItem">updateEditItem</el-button>
    <el-button type="primary" @click="getCheckItem">getCheckItem</el-button>
    <el-button type="primary" @click="updateCheckItem">updateCheckItem</el-button>
    <el-button type="primary" @click="submitTask">submitTask</el-button>
  </div>
</template>

<script>

export default {
  name: 'myHeader',
  data () {
    return {
      user_id: 4,
      user_token: '19980102',
      task_id: 987654,
      circleUrl:
        'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      squareUrl:
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      sizeList: ['large', 'medium', 'small']
    }
  },
  methods: {
    editPage: function (userId, userToken, taskId) {
      this.$router.push({
        name: 'edit',
        params: {
          user_id: userId,
          user_token: userToken,
          task_id: taskId
        }
      })
    },
    checkPage: function (userId, userToken, taskId) {
      this.$router.push({
        name: 'check',
        params: {
          user_id: userId,
          user_token: userToken,
          task_id: taskId
        }
      })
    },
    handleEditor: function () {
      this.$router.push('/editor')
    },
    handleAssign: function (userId, userToken, taskId) {
      this.$router.push({
        name: 'assignTask',
        params: {
          user_id: userId,
          user_token: userToken,
          task_id: taskId
        }
      })
    },
    sendMessage: function (input1, input2) {
      console.log(input1, input2)
      let msg = JSON.stringify({'user_id': 3,'task_id':987654})
      console.log(msg)

      this.$axios
        .post('/api/searchUserId', msg)
        .then(function (res) {
          console.log(res)
        })
    },
    updateEditItem () {
      let msg = JSON.stringify({
        task_id: 1,
        item_id: 94, // id
        original_id: 1, // original_id
        name: '', // name
        field: [], // field
        imageUrl: '', // imageUrl
        intro: '', // intro
        info_box: [], // info_box
        content: '', // content
        reference: [],
        relation: [], // relation
        status: 0})
      console.log(msg)

      this.$axios
        .post('/api/updateEditItem', msg)
        .then(function (res) {
          console.log(res)
        })
    },
    getCheckItem () {
      let msg = JSON.stringify({task_id: 1})
      console.log(msg)

      this.$axios
        .post('/api/getCheckItem', msg)
        .then(function (res) {
          console.log(res)
        })
    },
    updateCheckItem () {
      let msg = JSON.stringify({task_id: 1,item_id:28,checkResult:1})
      console.log(msg)

      this.$axios
        .post('/api/updateCheckItem', msg)
        .then(function (res) {
          console.log(res)
        })
    },
    submitTask () {
      let msg = JSON.stringify({task_id: 987654, token: '19980307', subtask: [{"name":"新建词条","content":"新建7条词条","type":1,"money":500.00,"itemCount":7}]})
      console.log(msg)

      this.$axios
        .post('/api/taskSplit', msg)
        .then(function (res) {
          console.log(res)
        })
    }
    // getInitItems () {
    //   let msg = JSON.stringify({})
    //   console.log(msg)
    //
    //   this.$axios
    //     .post('/api/taskSplit', msg)
    //     .then(function (res) {
    //       console.log(res)
    //     })
    // }

  }

}
</script>

<style scoped>
.el-button {
  margin: 0 auto;
}

.header {
  position: relative;
  top: 0px;
  left: 0px;
  right: 0px;
  height: 35px;
  width: 100%;
}

.header-middle {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  justify-content: space-between;
  height: 35px;
}

.header-l {
  float: left;
  height: 35px;
}

.header-l-title1 {
  color: #409eff;
  font-weight: 300;
  font-size: 21px;
  margin-top: 4px;
  cursor: pointer;
  float: left;
}

.header-l-title2 {
  color: #8a8a8a;
  font-size: 13px;
  float: left;
  margin-left: 10px;
  margin-top: 11px;
}

.header-m {
  width: 900px;
  height: 35px;
  margin-right: 250px;
  margin-top: 6px;
}

.header-link {
  color: #707070;
  font-size: 14px;
  margin-left: 10px;
}

.header-r {
  float: right;
  font-size: 18px;
}

.header-line {
  width: 100%;
  border-bottom: 1px solid #ddd;
}

.header-login-line {
  float: left;
  border-right: 1px solid #707070;
  height: 20px;
  margin-left: 7px;
  margin-top: 8px;
}

.header-icon {
  float: left;
  width: 30px;
  height: 30px;
  left: 0;
  top: 0;
  margin-top: -5px;
  margin-right: 7px;
}

.header-face-user {
  border: 1px solid #8bbb0f;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  margin-top: -1px;
}

.header-face {
  border: 1px solid #8bbb0f;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.el-dropdown :hover {
  color: #409EFF;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.header-createsubject {
  width: 80px;
  height: 35px;
  background-color: #409EFF;
  line-height: 42px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  border-radius: 0 0 6px 6px;
  margin-left: 10px;
}

.header-createsubject:hover {
  color: #fff;
  opacity: 0.85;
}
</style>
