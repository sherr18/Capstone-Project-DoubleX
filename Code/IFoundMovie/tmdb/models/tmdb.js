const axios = require('axios');
//用户API
const api_key="361f05c43d80eb10c49a953abd35668b";
const pyUrl="http://127.0.0.1:5000";
const Axios=axios.create({
    proxy:{
        "host":"127.0.0.1",
        "port":"7890",
        "protocol":"http"
    }
})
const PyAxios=axios.create({
    proxy:{
        "host":"127.0.0.1",
        "port":"3007",
        "protocol":"http"
    }
})


//查询电影列表信息
const findMovieListModel=async(list_id)=>{
    var data=null;
    await Axios.get('https://api.themoviedb.org/3/list/'+list_id+"?api_key="+api_key).then(function(res){
        data=res.data;
    });
    return data;
}

//查询十个电影列表名称
const findTenMovieListModel=async()=>{
    var data=[];
    for(var i=1;i<=10;i++){
        await Axios.get('https://api.themoviedb.org/3/list/'+i+"?api_key="+api_key).then(function(res){
            data.push(res.data);
        });
    }
    return data;
}

//根据名称查询电影内容
const searchMovieModel=async(query)=>{
    var data=[];
    await Axios.get('https://api.themoviedb.org/3/search/movie?api_key='+api_key+"&query="+query).then(function(res){
        data=res.data.results;
        // console.log(res.data.results);
    });
    return data;
}


//获取正在播放的院线电影列表
const nowMovieModel=async()=>{
    var data=[];
    await Axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key='+api_key+"&language=en-US&region=CA").then(function(res){
        let results=res.data.results;
        let now_results=[];
        results.forEach(element => {
            element.temp=new Date(element.release_date).getTime();
            now_results.push(element);
        });
        now_results=now_results.sort(function(a,b){return b.temp-a.temp});
        data=now_results;
    });
    return data;
}

//获取即将播放的电影列表
const upcomingMovieModel=async()=>{
    var data=[];
    await Axios.get('https://api.themoviedb.org/3/movie/upcoming?api_key='+api_key+"&language=en-US&region=CA").then(function(res){
        let results=res.data.results;
        let now_results=[];
        results.forEach(element => {
            element.temp=new Date(element.release_date).getTime();
            now_results.push(element);
        });
        now_results=now_results.sort(function(a,b){return b.temp-a.temp});
        data=now_results;
    });
    return data;
}

//获取tmdb流行的电影列表
const popularMovieModel=async()=>{
    var data=[];
    await Axios.get('https://api.themoviedb.org/3/movie/popular?api_key='+api_key+"&language=en-US&page=1").then(function(res){
        let results=res.data.results;
        let now_results=[];
        results.forEach(element => {
            element.temp=new Date(element.release_date).getTime();
            now_results.push(element);
        });
        now_results=now_results.sort(function(a,b){return b.temp-a.temp});
        data=now_results;
    });
    return data;
}


//查询电影详情信息
const findMovieDetailModel=async(movie_id)=>{
    var data=null;
    await Axios.get('https://api.themoviedb.org/3/movie/'+movie_id+"?api_key="+api_key).then(async function(res){
        data=res.data;
        console.log(data);
        await Axios.get('https://api.themoviedb.org/3/movie/'+movie_id+"/credits?api_key="+api_key).then(function(res2){
            res2.data.crew.forEach(item=>{
                if(item.job=="Director" && item.department=="Directing"){
                    data.director=item;
                }
            })
        });
    });
    
    return data;
}

//获取电影推荐列表
const recommendModel=async(movie)=>{
    var genresList=[];
    var movieName=movie.title.toLowerCase();
    var director=movie.director.name;
    let recomeList=[];
    var movieList=[];
    movie.genres.forEach(item=>{
        genresList.push(item.name);
    }); 
    
    await axios.post(
        pyUrl+"/remod",{directorName:director,movieName:movieName,genresList:genresList},
    ).then(function(res){
        res.data.forEach(item=>{
            item.forEach(item2=>{
                var bl=true;
                movieList.forEach(item3=>{
                    if(item3==item2){
                        bl=false;
                    }
                });
                if(item2==movieName){
                    bl=false;
                }
                if(bl){
                    movieList.push(item2)
                }
            })
        })
    }).catch(function(){

    }); 
    console.log(movieList);

    for( let item of movieList ){
        movie_now=await searchMovieModel(item);
        recomeList.push({
            "id":movie_now[0].id,
            "release_date":movie_now[0].release_date,
            "title":movie_now[0].title,
            "poster_path":movie_now[0].poster_path
        });
    }

    return recomeList;
}   
 
//查询当前电影的所有评论记录
const findCommentAllModel=async(mid)=>{
    var commentList=[];
    await axios.get(pyUrl+"/comments/"+mid).then(function(res){
        commentList=res.data.data.commentList;
    }).catch(function(){

    }); 
    return commentList;
}

//查询当前电影评论对应的用户信息
const findCommentByUserModel=async(comment)=>{
    var now_comment=[];
    for( let item of comment ){
        var uid=item[4];
        await axios.get(pyUrl+"/user/"+uid).then(function(res){
            item[4]=res.data.data.user[0];
            now_comment.push(item);
        }).catch(function(){
    
        }); 
    }
    return now_comment;
}
 
module.exports={  
    findMovieListModel,
    findTenMovieListModel,
    searchMovieModel,
    nowMovieModel,
    upcomingMovieModel,
    popularMovieModel,
    findMovieDetailModel,
    recommendModel,
    findCommentAllModel,
    findCommentByUserModel,
}
