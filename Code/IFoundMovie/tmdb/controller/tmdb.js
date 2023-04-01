const{
    findMovieListModel,findTenMovieListModel,searchMovieModel,
    nowMovieModel,
    upcomingMovieModel,
    popularMovieModel,findMovieDetailModel,recommendModel,findCommentAllModel,
    findCommentByUserModel,
}=require(process.cwd()+'/models/tmdb');
const ejs=require('ejs');
const fs = require('fs');

//login
const openLogin=async(req,res)=>{
    fs.readFile('./view/login.ejs',function(err,nowData){
        var template=nowData.toString();
        var html=ejs.render(template); 
        res.status(200).end(html);
   });
}

//register
const openRegister=async(req,res)=>{
    fs.readFile('./view/register.ejs',function(err,nowData){
        var template=nowData.toString();    
        var html=ejs.render(template);
        res.status(200).end(html);
   });
}


//Query the movie list control layer
const findMovieList=async(req,res)=>{
    const list_id =req.query.proplue_id;
    //Operational database
    let rs=await findMovieListModel(list_id);
    fs.readFile('./view/proplueMovie.ejs',function(err,nowData){
         var template=nowData.toString();
         var dictionary={data:rs};
         var html=ejs.render(template,dictionary);
         res.status(200).end(html);
    });
}

//Get a list of ten hot movies
const findTenMovieList=async(req,res)=>{
    let rs= await findTenMovieListModel();
    fs.readFile('./view/proplueList.ejs',function(err,nowData){
        var template=nowData.toString();
        var dictionary={data:rs};
        var html=ejs.render(template,dictionary);
        res.status(200).end(html);
   });
}

//search movies
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

//Home page shows playing theaters, coming soon, tmdb popular, movie list,
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
 
//search movie detail
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



//export numbers
module.exports={
    openLogin,
    openRegister,
    indexMovie,
    findMovieList,
    searchMovie,
    findTenMovieList,
    detailMovie,
}
