<template>
  <div></div>
</template>

<script>
export default {
  name: "subtaskLogin",
  data() {
    return {
      serverUrl: 'http://101.200.34.92:8081',
      user_id: 0,
      task_id: 0,
      token: '',
      inside_token: '',
      role: 2,
      jumpName: 'edit'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

      console.log('subtaskLogin登录信息: ', this.$route)
      if (JSON.stringify(this.$route.query) == '{}') {
        this.task_id = 0
        this.user_id = 0
        this.token = ''
      } else {
        this.task_id = this.$route.query.task_id
        this.user_id = this.$route.query.user_id
        this.token = this.$route.query.token
        // 调用后端进行校验


      }

      let msg = JSON.stringify({token: this.token})

      console.log('任务划分登录-请求后台校验：', msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/userLogin', msg)
        .then(res => {
          console.log('token校验结果：', res)
          this.inside_token = res.data.data.inside_token
          this.role = res.data.data.role
          this.user_id = res.data.data.user_id
          console.log(this.inside_token)
          window.sessionStorage.setItem('token', this.inside_token)


          if (this.role == 2) {
            this.jumpName = 'edit'
          } else if (this.role == 3) {
            this.jumpName = 'check'
          }

          console.log('subtaskLogin: ', this.task_id, ' ', this.token, ' ', this.user_id)
          this.$router.push(
            {
              path: '/' + this.jumpName,
              query: {
                task_id: this.task_id,
                user_token: this.token,
                user_id: this.user_id
              }
            }
          )


        })
        .catch(error => {
          console.log('用户校验失败：', error)
        })


      // 将task_id和token发送到后端进行校验及存储
      // 获取返回结果，正确则根据用户类别跳转至edit或者check页面，并传入相应的用户信息参数，如task_id，user_id
      // 错误则发送错误信息，拒绝访问？
      // if (this.role == 2) {
      //   this.jumpName = 'edit'
      // } else if (this.role == 3) {
      //   this.jumpName = 'check'
      // }
      //
      // console.log('subtaskLogin: ', this.task_id, ' ', this.token, ' ', this.user_id)
      // this.$router.push(
      //   {
      //     name: this.jumpName,
      //     query: {
      //       task_id: this.task_id,
      //       user_token: this.token,
      //       user_id: this.user_id
      //     }
      //   }
      // )


    }
  }
}
</script>

<style scoped>

</style>
