const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV; //环境变量

// 写日志
function writeLog(writeStream, log) {
  writeStream.write(log + "\n"); //关键代码
}

// 生成write Stream
function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, "../", "../", "logs", fileName);
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: "a",
  });
  return writeStream;
}
const accessWriteStream = createWriteStream("access.log");

// 写访问日志
function access(log) {
  // if (env == "dev") {
  //   console.log(log);
  // } else if (env == "production") {
  //   writeLog(accessWriteStream, log);
  // }

  writeLog(accessWriteStream, log);
}
module.exports = {
  access,
};
