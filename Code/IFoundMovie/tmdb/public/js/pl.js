$(function(){
    var mid=window.location.search.split("=")[1];
    if(mid==767){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=q5-CWXlUhxk");
    }else if(mid==672){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=rHG2273TqAk");
    }else if(mid==674){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=Pl4_d0P0BXk");
    }else if(mid==671){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=epUSmNt0bGQ");
    }else if(mid==675){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=w8nYq_EduL4");
    }else if(mid==673){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=nTFYoXbps6g");
    }else if(mid==12445){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=4RygwWJH4nM");
    }else if(mid==12444){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=tshJbq-wgrI");
    }else if(mid==899082){
        $("#movie_href").attr("href","https://www.youtube.com/watch?v=BZjA2UmGozA");
    }else if(mid==0){
        $("#movie_href").attr("href","");
    }else if(mid==0){
        $("#movie_href").attr("href","");
    }  
})

function copyUrl(){
    var url=window.location.href;
    const textCopied = ClipboardJS.copy(url);
    alert("Copy URL successfully!");
}