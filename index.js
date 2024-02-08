const redis = require("redis");

// !为了分割这一行和上一行，如果上一行没有;结尾
!(async function () {
  // 创建客户端
  const redisClient = redis.createClient(6379, "127.0.0.1");

  // 连接
  await redisClient
    .connect()
    .then(() => console.log("redis connect sucess!"))
    .catch(console.error);

  await redisClient.set("myname", "zhangsan");

  // get
  const myname = await redisClient.get("myname");
  console.log("myname", myname);

  // 退出
  redisClient.quit();
})();
