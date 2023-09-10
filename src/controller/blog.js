const getList = (author, keyword) => {
  // 先返回假数据(格式是正确的)
  return [
    {
      id: 1,
      title: "标题A",
      content: "内容A",
      createTime: 1694317992475,
      author: "小米",
    },
    {
      id: 2,
      title: "标题B",
      content: "内容B",
      createTime: 1694318048011,
      author: "小华",
    },
  ];
};
const getDetail = (id) => {
  // 先返回假数据
  return {
    id: 1,
    title: "标题A",
    content: "内容A",
    createTime: 1694317992475,
    author: "小米",
  };
};
const newBlog = (blogData = {}) => {
  // blogData是一个博客对象，包含title content属性
  return {
    id: 3, // 表示新建博客，插入到数据表里面的id
  };
};
const updateBlog = (id, blogData = {}) => {
  // id就是要更新博客的id
  // blogData是一个博客对象，包含title content属性
  console.log("update blog", id, blogData);
  return false;
};
const delBlog = (id) => {
  // id 就是要删除博客的id
  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
