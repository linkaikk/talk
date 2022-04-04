//IIFE
(() => {
  //获取所有需要的dom元素
  const doms = {
    form: document.querySelector("#formContainer"),
    registerId: document.querySelector("#userName"),
    nickname: document.querySelector("#userNickname"),
    registerPwd: document.querySelector("#userPassword"),
    repeatPwd: document.querySelector("#userConfirmPassword"),
  };

  let isExist = false;
  //所有的绑定事件都写在此
  function allEvents() {
    doms.registerId.addEventListener("blur", setRegisterIdEvent);
    doms.form.addEventListener("submit", setFormEvent);
  }

  //注册用户名的事件
  async function setRegisterIdEvent() {
    const idValue = this.value;
    if (!idValue) {
      return;
    }
    // const response = await fetch(
    //   `https://study.duyiedu.com/api/user/exists?loginId=${idValue}`
    // );
    // const result = await response.json();
    // isExist = result.data;
    // if (result.data) {
    //   window.alert("用户名已存在");
    // }
    //用通用函数的方法
    const res = await fetchFn({
      url: "/user/exists",
      method: "GET",
      params: {
        loginId: idValue,
      },
    });
    isExist = res;
    if (res) {
      window.alert("用户名已经存在");
    }
  }

  //提交表单的事件
  function setFormEvent(e) {
    e.preventDefault();
    const registerIdValue = doms.registerId.value;
    const nicknameValue = doms.nickname.value;
    const registerPwdValue = doms.registerPwd.value;
    const repeatPwdValue = doms.repeatPwd.value;
    //验证账号
    if (
      !varify(registerIdValue, nicknameValue, registerPwdValue, repeatPwdValue)
    ) {
      return;
    }
    //发送数据
    sendData(registerIdValue, nicknameValue, registerPwdValue);
  }

  async function sendData(registerIdValue, nicknameValue, registerPwdValue) {
    // const response = await fetch("https://study.duyiedu.com/api/user/reg", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     loginId: registerIdValue,
    //     nickname: nicknameValue,
    //     loginPwd: registerPwdValue,
    //   }),
    // });
    // const result = await response.json();
    // if (result.code !== 0) {
    //   return;
    // }
    const res = await fetchFn({
      url: "/user/reg",
      method: "POST",
      params: {
        loginId: registerIdValue,
        nickname: nicknameValue,
        loginPwd: registerPwdValue,
      },
    });
    if (!res) {
      return;
    }
    window.alert("注册成功");
    window.location.replace(baseUrl+"/index.html");
  }

  //验证表单函数
  function varify(
    registerIdValue,
    nicknameValue,
    registerPwdValue,
    repeatPwdValue
  ) {
    if (!registerIdValue) {
      window.alert("用户名不能为空");
      return;
    }
    if (!nicknameValue) {
      window.alert("昵称不能为空");
      return;
    }
    if (!registerPwdValue) {
      window.alert("密码不能为空");
      return;
    }
    if (registerPwdValue !== repeatPwdValue) {
      window.alert("两次输入的密码不一致");
      return;
    }
    if (isExist) {
      window.alert("用户名已经存在");
      return;
    }
    return true;
  }

  //函数入口
  function main() {
    allEvents();
  }

  main();
})();
