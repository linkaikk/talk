//默认地址
const base_url = "https://study.duyiedu.com/api";

//通用函数
async function fetchFn({ url, method = "GET", params = {} }) {
  let result;
  //进行sessionStorage.token的判断 如果有值 则往请求头添加东西
  const expands = {};
  sessionStorage.token &&
    (expands.Authorization = "Bearer " + sessionStorage.token);
  // get请求参数的拼接
  if (method === "GET" && Object.keys(params).length) {
    url +=
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
  }
  try {
    const response = await fetch(base_url + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...expands,
      },
      body: method === "GET" ? null : JSON.stringify(params),
    });
    const token = response.headers.get("Authorization");
    token && (sessionStorage.token = token);
    result = await response.json();
    if (result.code === 0) {
      /* 如果后端返回值里面有chatTotal，我们就把这个chatTotal也返回给前台 */
      if (result.hasOwnProperty("chatTotal")) {
        result.data = { chatTotal: result.chatTotal, data: result.data };
      }
      return result.data;
    } else {
      //错误权限处理
      if (result.status === 401) {
        window.alert("权限token不正确");
        sessionStorage.removeItem("token");
        window.location.replace("/login.html");
        return;
      }
      window.alert(result.msg);
    }
  } catch (err) {
    console.log(err);
  }
}
