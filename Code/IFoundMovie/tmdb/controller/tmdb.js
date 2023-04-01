const{
    findMovieListModel,findTenMovieListModel,searchMovieModel,
    nowMovieModel,
    upcomingMovieModel,
    popularMovieModel,findMovieDetailModel,recommendModel,findCommentAllModel,
    findCommentByUserModel,
}=require(process.cwd()+'/models/tmdb');
const ejs=require('ejs');
const fs = require('fs');

//进入登录页面
const openLogin=async(req,res)=>{
    fs.readFile('./view/login.ejs',function(err,nowData){
        var template=nowData.toString();
        var html=ejs.render(template); 
        res.status(200).end(html);
   });
}

//进入注册页面
const openRegister=async(req,res)=>{
    fs.readFile('./view/register.ejs',function(err,nowData){
        var template=nowData.toString();    
        var html=ejs.render(template);
        res.status(200).end(html);
   });
}


//查询电影列表控制层
const findMovieList=async(req,res)=>{
    const list_id =req.query.proplue_id;
    //操作数据库
    let rs=await findMovieListModel(list_id);
    fs.readFile('./view/proplueMovie.ejs',function(err,nowData){
         var template=nowData.toString();
         var dictionary={data:rs};
         var html=ejs.render(template,dictionary);
         res.status(200).end(html);
    });
}

//获取十个热门电影列表
const findTenMovieList=async(req,res)=>{
    let rs= await findTenMovieListModel();
    fs.readFile('./view/proplueList.ejs',function(err,nowData){
        var template=nowData.toString();
        var dictionary={data:rs};
        var html=ejs.render(template,dictionary);
        res.status(200).end(html);
   });
}

//搜索电影
const searchMovie=async(req,res)=>{
    const{query}=req.params;
    let rs= await searchMovieModel(query);
    fs.readFile('./view/search.ejs',function(err,nowData){
        var template=nowData.toString();
        var dictionary={data:rs,Keywords:query};
        var html=ejs.render(template,dictionary);
        res.status(200).end(html);
   });
}

//首页显示 正在播放的院线、即将播放、tmdb流行、电影列表、
const indexMovie=async(req,res)=>{
    let nowList= await nowMovieModel();
    let upcomingList=await upcomingMovieModel();
    let popularList=await popularMovieModel();
    fs.readFile('./view/index.ejs',function(err,nowData){
        var template=nowData.toString();
        var dictionary={nowList:nowList,upcomingList:upcomingList,popularList:popularList};
        var html=ejs.render(template,dictionary);
        res.status(200).end(html);
   });
}
 
//查找电影详情  
const detailMovie=async(req,res)=>{
    const movie_id=req.query.movie_id;
    let movie= await findMovieDetailModel(movie_id);
    //console.log(movie);
    let comment=await findCommentAllModel(movie_id);
    let now_comment=await findCommentByUserModel(comment);
    let recommend=await recommendModel(movie);
    fs.readFile('./view/celebrities.ejs',function(err,nowData){
        var template=nowData.toString(); 
        var dictionary={movie:movie,recommend:recommend,comment:now_comment};
        var html=ejs.render(template,dictionary);
        res.status(200).end(html); 
   });
}



//导出成员
module.exports={
    openLogin,
    openRegister,
    indexMovie,
    findMovieList,
    searchMovie,
    findTenMovieList,
    detailMovie,
}