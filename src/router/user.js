const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const handleUserRouter = (req, res) => {
  const method = req.method; // GET POST

  // 登录
  if (method === "GET" && req.path === "/api/user/login") {
    // const result = login(req.body);
    const result = login(req.query);
    return result.then((data) => {
      if (data.username) {
        // 操作cookie
        // path=/表示这个cookie适用于根目录，适用于该网站下的所有路由网页，如果不设置path=/，由于是在路由"/api/user/login"设置cookie，那path值就是该路由，访问其他路由时该cookie就会失效
        res.setHeader("Set-Cookie", `username=${data.username}; path=/`);
        return new SuccessModel();
      }
      return new ErrorModel("登录失败");
    });
  }

  // 登录验证的测试
  if (method === "GET" && req.path === "/api/user/login-text") {
    if (req.cookie.username) {
      return Promise.resolve(
        new SuccessModel({ username: req.cookie.username })
      );
    }
    return Promise.resolve(new ErrorModel("尚未登录"));
  }
};
module.exports = handleUserRouter;
