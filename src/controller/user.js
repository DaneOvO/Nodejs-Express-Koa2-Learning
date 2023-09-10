const loginCheck = (loginData) => {
  const { username, password } = loginData;
  // 先使用假数据
  if (username === "zhangsan" && password === "123456") {
    return true;
  }
  return false;
};
module.exports = {
  loginCheck,
};
