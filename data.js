// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost",// this will work
  user: "C4131F23U111",
  database: "C4131F23U111",
  password: "12371", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.
async function getUser(data){
    let result = await connPool.awaitQuery("select id,p_hash from user where username=?",[data.username]);
    return result;
}

async function addUser(data){
  let result = await connPool.awaitQuery("insert into user (email, username, p_hash) values (?,?,?)",[data.email, data.username,data.p_hash]);
  if(result.affectedRows==1){
      return await connPool.awaitQuery("select id from user where username=?",[data.username]);
  }
  return false;
}

async function addPost(data){
  let result = await connPool.awaitQuery("insert into posts (content, likes, author) values (?,?,?)",[data.content,data.likes,data.author]);
  if(result.affectedRows==1){
    return true;
  }
  return false;

}

async function getUserPosts(data){
  let result = await connPool.awaitQuery("select content,likes,id from posts where author=? ORDER BY time desc",[data.user_id]);
  return result;
}

async function getAllPostsRecent(){
  let result = await connPool.awaitQuery("select posts.content, posts.likes, posts.id, user.username from posts inner JOIN user on posts.author=user.id ORDER BY posts.time desc;");
  return result
}

async function getAllPostsHot(){
  let result = await connPool.awaitQuery("select posts.content, posts.likes, posts.id, user.username from posts inner JOIN user on posts.author=user.id ORDER BY posts.likes desc;");
  return result;
}
async function updatePostLikeCount(data){
    let count = await connPool.awaitQuery("select posts.likes from posts where id=?",[data.id]);
    if(count.length > 0){
      count = count[0].likes;
      let result = await connPool.awaitQuery("update posts set likes=? where id=?",[count+1,data.id]);
      if(result.affectedRows==1){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
}

async function deletePost(data){
  let result = await connPool.awaitQuery("delete from posts where id = ? and author=?",[data.post_id,data.user_id]);
  if(result.affectedRows==1){
    return true;
  }
  else{
    return false;
  }
}

async function editPost(data){
  let result = await connPool.awaitQuery("update posts set content=?, time=current_timestamp() where id=? and author=?",[data.content,data.post_id,data.user_id]);
  if(result.affectedRows==1){
    return true;
  }
  else{
    return false;
  }
}

async function getUsername(data){
  let result = await connPool.awaitQuery("select username from user where id=?",[data.id]);
  return result;
}

module.exports = {getUser,addUser,addPost,getUserPosts,getAllPostsRecent,getAllPostsHot,updatePostLikeCount,deletePost,editPost,getUsername}