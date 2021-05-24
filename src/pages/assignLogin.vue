<template>
  <div></div>
</template>

<script>
export default {
  name: 'assignLogin',
  data() {
    return {
      serverUrl: 'http://101.200.34.92:8081',
      task_id: 0,
      user_id: 0,
      token: '',
      inToken: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log('划分任务登录页面-传入参数：',this.$route)
      if (JSON.stringify(this.$route.query) == '{}') {
        this.task_id = 0
        this.user_id = 0
        this.token = ''
      } else {
        this.task_id = this.$route.query.task_id
        this.user_id = this.$route.query.user_id
        this.token = this.$route.query.token
      }

      // 将task_id和token发送到后端进行校验及存储
      // 获取返回结果，正确则跳转至assignTask页面，并传入相应的用户信息参数，如task_id，user_id
      // 错误则发送错误信息，拒绝访问？
      let msg = JSON.stringify({token: this.token})

      console.log('任务划分登录-请求后台校验：',msg)
      this.$axios
        .post(this.serverUrl + '/inside_api/entry/userLogin', msg)
        .then(res => {
          console.log('token校验结果：', res)
          this.inToken = res.data.data.inside_token
          console.log(this.inToken)
          window.sessionStorage.setItem('token', this.inToken)


          this.$router.push(
            {
              name: 'assignTask',
              query: {
                task_id: this.task_id,
                user_token: this.inToken,
                user_id: this.user_id
              }
            }
          )
        })
        .catch(error => {
          console.log('用户校验失败：', error)
          this.$message.error('用户权限校验失败')
        })
    }
  }
}
</script>

<style scoped>

</style>
