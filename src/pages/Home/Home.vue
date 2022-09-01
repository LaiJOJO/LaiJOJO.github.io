<template>
  <div class="box">
    <div class="title"><span>用户管理</span></div>
    <!-- 遮罩层true显示 -->
    <div class="hide" v-if="dialogVisible"></div>

    <div class="banner">
      <!-- 头部搜索栏 -->
      <div class="nav">
        <div class="left">
          <button class="btn" @click="changeUsers(null)">新建</button>
          <input class="search" v-model="input" @focus="focus()" @blur="blur()" />
        </div>
        <div class="right">
          <button class="btn" @click="layout">撤销</button>
        </div>
      </div>

      <!-- 表格栏 -->
      <div class="table-box">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>姓名</th>
              <th>年龄</th>
              <th>性别</th>
              <th>联系电话</th>
              <th>详细地址</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eachUser in usersInfoCopy" :key="eachUser">
              <td><input type="checkbox" class="checkbox" v-model="eachUser.ischecked"></td>
              <td><span class="info">{{ eachUser.name }}</span></td>
              <td><span class="info">{{ eachUser.age }}</span></td>
              <td><span class="info">{{ eachUser.gender }}</span></td>
              <td><span class="info phone">{{ eachUser.phone }}</span></td>
              <td><span class="info address">{{ eachUser.address }}</span></td>
              <td>
                <div class="control">
                  <button style="margin-right:5px;" @click="changeUsers(eachUser.id)">编辑</button>
                  <button @click="deleteUser(eachUser.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 批量删除 -->
      <div class="del-btn">
        <button @click="deleteMore">批量删除</button>
      </div>
    </div>

    <!-- 新建/编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" width="50%" :before-close="handleClose" :show-close="false"
      :close-on-click-modal="false" :modal="false" title="新建/编辑用户">
      <!-- 表单 -->
      <span>
        <el-form :model="form" label-width="120px" @submit.prevent inline size="large" label-position="top"
          :rules="rules" ref="formRef">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" :style="'width:300px'" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" :style="'width:300px'">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" :style="'width:500px'" prop="phone">
            <el-input v-model.number="form.phone" :style="'width:300px'" />
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <div class="example-block">
              <span class="example-demonstration"></span>
              <el-cascader placeholder="请选择地址" :options="options" :props="hover" @change="handleChange" />
            </div>
            <el-input v-model="form.detailAddress" :style="'width:390px;margin-left:40px;'" />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
          <el-button type="primary" style="margin-left:0px" @click="saveUsers(formRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'Home',
  setup() {
    const input = ref('')
    const dialogVisible = ref(false)
    // 已存在用户
    const usersInfo = reactive([{ allowDelete: false, id: 1, ischecked: false, name: '张三', age: 18, gender: '男', phone: 'xxxxx', address: 'xxxxxxxxx' }])
    const usersInfoCopy = reactive([])
    const id = computed(() => usersInfo.length)
    const currentId = ref(-1)
    // 校验规则
    const rules = reactive({
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 8, message: '请输入2-8个汉字', trigger: 'blur' },
      ],
      gender: [
        {
          required: true,
          message: '请选择性别',
          trigger: 'change',
        },
      ],
      phone: [
        {
          required: true,
          message: '请输入电话(11位数字)',
          trigger: 'blur',
        },
        { type: 'number', message: '请输入电话(11位数字)' },
      ],
      detailAddress: [
        {
          required: true,
          message: '请输入地址',
          trigger: 'blur',
        },
      ],
    })
    const formRef = ref(null)
    // 新建用户
    const form = reactive({
      name: '',
      gender: '',
      phone: '',
      age: '18',
      address: '',
      detailAddress: ''
    })
    // 聚焦失焦时触发
    function focus() {
      input.value = input.value === '按关键字搜索' ? '' : input.value
    }
    function blur() {
      input.value = input.value === '' ? '按关键字搜索' : input.value
      // 不用过滤
      if (input.value === '按关键字搜索') {
        usersInfoCopy.splice(0)
        for (let i = 0; i < usersInfo.length; i++) {
          usersInfoCopy.push(usersInfo[i])
        }
      } else {
        // 过滤后
        usersInfoCopy.splice(0)
        usersInfo.forEach(eachUser => {
          if (eachUser.name.indexOf(input.value) != -1 || eachUser.gender.indexOf(input.value) != -1 || String(eachUser.age).indexOf(input.value) != -1 || eachUser.address.indexOf(input.value) != -1) {
            usersInfoCopy.push(eachUser)
          }
        })
        if (usersInfoCopy.length === 0) {
          usersInfoCopy.push(usersInfo[0])
        }
      }

    }

    // 关闭表单触发
    function handleClose() {
      ElMessageBox.confirm(
        '信息尚未保存，是否确认关闭?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          dialogVisible.value = false
          ElMessage({
            type: 'info',
            message: '已取消保存',
          })
        })
        .catch(() => {

        })
    }

    // 删除用户信息
    function deleteUser(userid) {
      const findUserIndex = usersInfo.findIndex((eachUser) => {
        return eachUser.id === userid
      })
      if (findUserIndex == -1) {
        return
      }
      if (usersInfo[findUserIndex].allowDelete === false) {
        return ElNotification({
          title: '警告',
          message: '权限不够，禁止删除!',
          type: 'warning',
          duration: 1000,
        })
      }
      setOldItem(JSON.stringify(usersInfo))
      usersInfo.splice(findUserIndex, 1)
      resetId()
      setNewItem(JSON.stringify(usersInfo))
    }
    // 批量删除
    function deleteMore() {
      let idArr = []
      usersInfo.forEach(eachUser => {
        if (eachUser.ischecked) {
          idArr.push(eachUser.id)
        }
      })
      const oldUsersInfo = JSON.stringify(usersInfo)
      for (let i = 0; i < idArr.length; i++) {
        const findUserIndex = usersInfo.findIndex((eachUser) => {
          return eachUser.id === idArr[i]
        })
        // 带权限的不允许删除
        if (usersInfo[findUserIndex].allowDelete === false) {
          return ElNotification({
            title: '警告',
            message: '权限不够，禁止删除张三!',
            type: 'warning',
            duration: 1000,
          })
        }
        usersInfo.splice(findUserIndex, 1)
      }
      setOldItem(oldUsersInfo)
      resetId()
      setNewItem(JSON.stringify(usersInfo))
    }
    // 重新排序id
    function resetId() {
      let newId = 1
      usersInfo.forEach((eachUser, index) => {
        usersInfo[index].id = newId
        newId++
      })
    }
    // 撤销
    function layout() {
      const oldUsersInfo = JSON.parse(localStorage.getItem('OLDUSERSINFO'))
      // 获取旧值后将现在的值作为旧值
      setOldItem(JSON.stringify(usersInfo))
      usersInfo.splice(0)
      for (let i = 0; i < oldUsersInfo.length; i++) {
        usersInfo.push(oldUsersInfo[i])
      }
      // 撤销后将旧值作为新值
      setNewItem(JSON.stringify(usersInfo))
    }

    // 保存表单
    async function saveUsers() {
      if (!formRef) return
      try {
        formRef.value.validate((valid) => {
        // 验证通过
        if (valid) {
          // 筛选当前修改的用户对象
          const findUserIndex = usersInfo.findIndex((eachUser) => {
            return eachUser.id === currentId.value
          })
          // 新增用户
          if (findUserIndex == -1) {
            const newUser = {}
            newUser.id = id.value
            newUser.ischecked = false
            newUser.name = form.name
            newUser.gender = form.gender
            newUser.age = form.age
            newUser.phone = form.phone
            newUser.address = form.address + form.detailAddress
            // 过滤完全相同信息
            let isInclude = filters(newUser)
            if (isInclude) {
              return ElMessage('相同信息已存在')
            }
            newUser.id = id.value + 1
            // 即使缓存新旧值
            setOldItem(JSON.stringify(usersInfo))
            usersInfo.push(newUser)
            setNewItem(JSON.stringify(usersInfo))
          }
          // 编辑用户
          else {
            setOldItem(JSON.stringify(usersInfo))
            usersInfo[findUserIndex].name = form.name
            usersInfo[findUserIndex].gender = form.gender
            usersInfo[findUserIndex].phone = form.phone
            usersInfo[findUserIndex].address = form.address + form.detailAddress
            setNewItem(JSON.stringify(usersInfo))
          }
          // 保存时关闭弹窗，当前id重置
          dialogVisible.value = false
          currentId.value = -1
        } else {
          return false
        }
      })
      } catch (error) {
        return false
      }

    }

    // 新增或编辑
    function changeUsers(userid) {
      if (userid) {
        const findUserIndex = usersInfo.findIndex((eachUser) => {
          return eachUser.id === userid
        })
        currentId.value = userid
        form.name = usersInfo[findUserIndex].name
        form.gender = usersInfo[findUserIndex].gender
        form.phone = usersInfo[findUserIndex].phone
        form.detailAddress = usersInfo[findUserIndex].address
        dialogVisible.value = true
      } else {
        // 没有id则清空form
        form.name = ''
        form.gender = ''
        form.phone = ''
        form.detailAddress = ''
        dialogVisible.value = true
      }
    }
    // 筛选重复函数
    function filters(newUser) {
      let result = false
      usersInfo.forEach((eachUser) => {
        if (eachUser.name === newUser.name && eachUser.address === newUser.address && eachUser.phone === newUser.phone) {
          result = true
        }
      })
      return result
    }

    // 本地会话存储新值
    function setNewItem(newItem) {
      localStorage.setItem('NEWUSERSINFO', newItem)
    }
    // 本地会话存储旧值
    function setOldItem(oldItem) {
      localStorage.setItem('OLDUSERSINFO', oldItem)
    }

    // 联级选择触发事件
    const hover = {
      expandTrigger: 'hover',
    }
    // 选择城市地址后进行转化
    const handleChange = (value) => {
      let str = ''
      value.forEach((each) => {
        str += each
      })
      form.address = str
    }

    const options = [
      {
        value: '广东省',
        label: '广东省',
        children: [
          {
            value: '广州市',
            label: '广州市',
            children: [
              {
                value: '番禺区',
                label: '番禺区',
              },
              {
                value: '越秀区',
                label: '越秀区',
              },
              {
                value: '海珠区',
                label: '海珠区',
              },
              {
                value: '天河区',
                label: '天河区',
              },
              {
                value: '白云区',
                label: '白云区',
              },
              {
                value: '荔湾区',
                label: '荔湾区',
              },
            ],
          }]
      }]

    // 即使更新复制的用户信息
    watch(usersInfo, () => {
      blur()
    })

    onMounted(() => {
      setOldItem(JSON.stringify(usersInfo))
      if (localStorage.getItem('NEWUSERSINFO')) {
        const oldUsersInfo = JSON.parse(localStorage.getItem('NEWUSERSINFO'))
        usersInfo.splice(0)
        for (let i = 0; i < oldUsersInfo.length; i++) {
          usersInfo.push(oldUsersInfo[i])
        }
      }
      setNewItem(JSON.stringify(usersInfo))
      blur()
    })

    return {
      input,
      usersInfo,
      dialogVisible,
      form,
      hover,
      options,
      id,
      currentId,
      rules,
      formRef,
      usersInfoCopy,
      focus,
      blur,
      handleClose,
      deleteMore,
      handleChange,
      changeUsers,
      saveUsers,
      deleteUser,
      layout
    }
  }
}
</script>

<style lang="less" scoped>
.box {

  .hide {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .title {
    height: 80px;
    font-size: 20px;
    font-weight: bold;
    background-color: #ececec;
    line-height: 80px;
    text-align: center;
  }

  .banner {
    padding: 45px 100px;

    button {
      border: 0;
      cursor: pointer;

      &:hover {
        background-color: #eaeaea;
      }
    }

    .nav {
      display: flex;
      justify-content: space-between;
      font-size: 15px;

      button {
        cursor: pointer;
      }

      .left {
        display: flex;

        .search {
          width: 340px;
          height: 30px;
          background-color: #ececec;
          margin-left: 12px;
          border: 0px;
          color: black;
          padding: 0 10px;
          font-size: 15px;
          font-weight: bold;
        }
      }

      .btn {
        width: 75px;
        height: 30px;
        border: 0px;
        font-weight: bold;
      }
    }

    .table-box {
      margin-top: 5px;
      font-size: 15px;
      width: 100%;

      .table {
        thead {
          height: 33px;
          background-color: #ececec;
        }

        tbody {
          box-sizing: border-box;
          height: 41px;

          tr {
            border: 1px solid #ebebeb;
            border-top: 0px;

            td {
              height: 40px;

              .info {
                text-align: center;
                line-height: 25px;
                width: 75px;
                height: 25px;
                background-color: #ececec;
                margin: 5px 20px;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .phone {
                width: 115px;
              }

              .address {
                width: 600px;
                margin-left: 50px;
                overflow: hidden;
              }

              .checkbox {
                margin-left: 17px;
              }

              .control {
                margin: auto 15px;
                font-size: 10px;
                width: 87px;

                button {
                  display: inline-block;
                  font-weight: bold;
                  height: 25px;
                  width: 40px;
                }
              }
            }
          }

        }
      }
    }

    .del-btn {
      margin-top: 10px;

      button {
        font-size: 15px;
        font-weight: bold;
        width: 75px;
        height: 33px;
        text-align: center;
      }
    }
  }

  .dialog-footer button:first-child {
    margin-right: 5px;
  }

  /deep/ .el-dialog__header {
    text-align: center;
  }

  /deep/ .el-dialog__title {
    font-size: 15px;
    color: black;
  }

  /deep/ .el-dialog__body {
    margin-left: 40px;
    height: 380px;
  }

  /deep/ .el-form--large.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 5px;
  }

  /deep/ .el-form--inline.el-form--label-top .el-form-item {
    margin-bottom: 15px;
  }
}
</style>