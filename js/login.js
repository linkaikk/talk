//IIFE
(() => {
  //所有的dom
  const doms = {
    loginId: document.querySelector("#userName"),
    loginPwd: document.querySelector("#userPassword"),
    form: document.querySelector("#formContainer"),
  };

  // 初始化函数
  function init() {}

  function allEvents() {
    doms.form.addEventListener("submit", function (e) {
      e.preventDefault();
      const loginIdValue = doms.loginId.value.trim();
      const loginPwdValue = doms.loginPwd.value.trim();
      if (!loginIdValue || !loginPwdValue) {
        window.alert("用户名或密码不能为空");
        return;
      }
      //如果密码和用户名不为空，发送数据
      sendData(loginIdValue, loginPwdValue);
    });
  }

  async function sendData(loginIdValue, loginPwdValue) {
    // const response = await fetch("https://study.duyiedu.com/api/user/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     loginId: loginIdValue,
    //     loginPwd: loginPwdValue,
    //   }),
    // });
    // const result = await response.json();
    // if (result.code !== 0) {
    //   window.alert(result.msg);
    //   return;
    // }
    const res = await fetchFn({
      url: "/user/login",
      method: "POST",
      params: {
        loginId: loginIdValue,
        loginPwd: loginPwdValue,
      },
    });
    res && window.location.replace("/index.html");
  }

  //所有函数入口
  function main() {
    init();
    allEvents();
  }

  main();
})();
