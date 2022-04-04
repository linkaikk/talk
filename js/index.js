(() => {
  //获取dom元素
  const doms = {
    nickName: document.querySelector(".nick-name"),
    accountName: document.querySelector(".account-name"),
    lastLoginTime: document.querySelector(".login-time"),
    content: document.querySelector(".content-body"),
    inputText: document.querySelector(".input-container"),
    sendBtn: document.querySelector(".send-btn"),
    arrow: document.querySelector(".arrow-container"),
    select: document.querySelector(".select-container"),
    close: document.querySelector(".close"),
  };
  //定义全局变量
  let page = 0;
  let size = 10;
  let keyboardStatus = "enter";
  let chatTotal = 0;
  //初始化工作
  async function init() {
    //获取当前用户的登录信息
    const res = await fetchFn({
      url: "/user/profile",
    });
    doms.nickName.innerText = res.nickname;
    doms.accountName.innerText = res.loginId;
    doms.lastLoginTime.innerText = formaDate(res.lastLoginTime);
    //获取聊天信息 添加到界面
    getChatMessage("bottom");
  }

  async function getChatMessage(statu) {
    const res = await fetchFn({
      url: "/chat/history",
      params: {
        page,
        size,
      },
    });
    //通过获取到的数据渲染页面函数
    chatTotal = res.chatTotal;
    createHtml(res.data, statu);
  }

  /**
   *
   * @param {*} res 参数为一个对象数组，key必须有content,from
   */
  function createHtml(res, statu) {
    //如果是刚注册的用户,没有任何的聊天记录,创造一条初始聊天记录
    if (!res.length) {
      doms.content.innerHTML = ` <div class="chat-container robot-container">
      <img src="./img/robot.jpg" alt="" />
      <div class="chat-txt">
        您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
      </div>
    </div>`;
    }
    //颠倒一下数组顺序
    res = res.reverse();
    const htmlString = res
      .map((item) => {
        return item.from === "user"
          ? `<div class="chat-container avatar-container">
      <img src="./img/avtar.png" alt="" />
      <div class="chat-txt">${item.content}</div>
    </div>`
          : `<div class="chat-container robot-container">
    <img src="./img/robot.jpg" alt="" />
    <div class="chat-txt">
      ${item.content}
    </div>
  </div>`;
      })
      .join("");
    //渲染完成后,滚动条到达最低端
    if (statu === "bottom") {
      //如果是在底部 把内容添加到底部
      doms.content.innerHTML += htmlString;
      const bottomDistance =
        doms.content.children[doms.content.children.length - 1].offsetTop;
      doms.content.scrollTop = bottomDistance;
    } else {
      //否则添加到顶部
      doms.content.innerHTML = htmlString + doms.content.innerHTML;
    }
  }

  //所有事件函数都在此
  function allEvents() {
    doms.sendBtn.addEventListener("click", setSendBtnEvent);
    doms.content.addEventListener("scroll", setScrollEvent);
    doms.arrow.addEventListener("click", setArrowEvent);
    Array.prototype.slice.call(doms.select.children).forEach((item) => {
      item.addEventListener("click", setSelectEvent);
    });
    doms.inputText.addEventListener("keydown", setInputEvent);
    doms.close.addEventListener("click", setCloseEvent);
  }

  //关闭按钮事件
  function setCloseEvent() {
    sessionStorage.removeItem("token");
    window.location.replace(baseUrl+"/login.html");
  }

  //监听在input按下键盘的事件
  function setInputEvent(e) {
    if (
      (e.keyCode === 13 && keyboardStatus === "enter" && !e.ctrlKey) ||
      (e.keyCode === 13 && keyboardStatus === "ctrlEnter" && e.ctrlKey)
    ) {
      setSendBtnEvent();
    }
  }

  //enter和ctrlenter的事件选择
  function setSelectEvent() {
    keyboardStatus = this.getAttribute("type");
    Array.prototype.slice.call(doms.select.children).forEach((item) => {
      item.classList.remove("on");
    });
    this.classList.add("on");
    doms.select.style.display = "none";
  }

  //箭头的点击事件
  function setArrowEvent() {
    //当选择框是打开时,关闭选择框
    if (doms.select.style.display === "block") {
      doms.select.style.display = "none";
      return;
    }
    //打开选择框
    doms.select.style.display = "block";
    //将原本选中的元素取消
  }

  //内容区滚动事件
  function setScrollEvent() {
    //判断滚动到最顶端时
    if (this.scrollTop === 0) {
      //判断后端是否还有数据
      if (chatTotal <= (page + 1) * size) {
        return;
      }
      //页数加一
      page++;
      //调用获取聊天消息函数
      getChatMessage("top");
    }
  }

  //发送按钮的监听事件
  async function setSendBtnEvent() {
    const content = doms.inputText.value.trim();
    doms.inputText.value = "";
    if (!content) {
      window.alert("输入的消息不能为空");
      return;
    }
    //渲染我们自己输入的信息
    createHtml([{ content, from: "user" }], "bottom");
    //接收发送聊天消息接口的数据
    const res = await fetchFn({
      url: "/chat",
      method: "POST",
      params: {
        content,
      },
    });
    //将接收到的消息渲染
    createHtml([{ content: res.content, from: "robot" }], "bottom");
  }

  //函数入口
  function main() {
    init();
    allEvents();
  }
  main();
})();
