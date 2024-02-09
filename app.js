const querystring = require("querystring");
const { get, set } = require("./src/db/redis");
const { access } = require("./src/utils/log");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// // session数据
// const SESSION_DATA = {};
// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000); // 设置有效期是一天
  return d.toGMTString();
};

// 用于处理post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 记录 access log
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}`
  );

  // res.setHeader("Access-Control-Allow-Credentials", true); // 允许跨域传递 cookie
  // res.setHeader("Access-Control-Allow-Origin", "*"); // 允许跨域的origin,*代表所有的域

  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET,POST,OPTIONS,PUT,PATCH,DELETE"
  // ); // 被允许跨域的Http方法
  // 设置返回格式 JSON
  res.setHeader("Content-type", "application/json");
  // 获取path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析query
  req.query = querystring.parse(url.split("?")[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ""; // k1=v1;k2=v2;k3=v3
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim(); // 如果是已经有cookie追加时key值前面会有空格，需要清除空格
    const val = arr[1];
    req.cookie[key] = val;
  });

  // // 解析session
  // let needSetCookie = false;
  // let userId = req.cookie.userid;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }
  // req.session = SESSION_DATA[userId];

  // 解析session (使用redis)
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    //初始化redis中的session值
    set(userId, {});
  }
  //获取session
  req.sessionId = userId;
  get(req.sessionId)
    .then((sessionData) => {
      if (sessionData == null) {
        //初始化redis中的session值
        set(req.sessionId, {});
        // 设置session
        req.session = {};
      } else {
        req.session = sessionData;
      }
      console.log("req.session ", req.session);

      // 处理post data
      return getPostData(req);
    })
    .then((postData) => {
      req.body = postData;
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userid=${userId}; path=/; httpOnly;expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 未命中路由，返回404,同时将返回格式修改为纯文本
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 NOT FOUND\n");
      res.end();
    });
};
module.exports = serverHandle;
