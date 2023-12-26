const mysql = require("mysql");

// 创建链接
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  port: 3306,
  database: "myblog",
});

// 开始连接
con.connect();
// 执行sql语句
// const sql = "select * from users;";
// const sql = `update users set realname = '李四2' where username = 'lisi'`;
const sql = `INSERT INTO blogs(title,content,createtime,author) VALUES ('标题C','内容C',1700988977111,'钱五')`;
con.query(sql, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("result", result);
});
// 关闭连接
con.end();
