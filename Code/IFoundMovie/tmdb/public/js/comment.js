var http="http://127.0.0.1:5000";
var token=localStorage.getItem("token");
$(function(){
    $("#login").html("");
    if(token!=""){
        $.ajax({
            url:http+"/token",
            method:"get",
            headers: { 
                "Authorization":"Bearer "+token,
            },
            success:function(res){
                console.log(res.username);
                if(res.username!=""){
                    $("#login").append("<p onclick='loginout()'><a href='javascript:void(0)'> Hello!"+res.username+"</a></p>")
                }else{
                    $("#login").append("<a href='/login'>Login</a>")
                }
            },error:function(res){
                $("#login").append("<a href='/login'>Login</a>")
            }
        })
    }else{
        $("#login").append("<a href='/login'>Login</a>")
    }
    
});

function loginout(){
    alert("login out successfully!");
    localStorage.setItem("token","");
    window.location.reload();
}

function register(){
    var username=$("#username").val();
    var password=$("#password").val();
    var re_password=$("#re_password").val();
    if(username!=""&&password!="" && re_password!=""){
        if(password==re_password){
            $.ajax({
                url:http+"/register",
                method:"POST",
                data:{"username":username,"password":password},
                success:function(res){
                    console.log(res);
                    if(res.status_code==200){
                        alert(res.message);
                        window.location.href="/login";
                    }else{
                        alert(res.message);
                    }
                },error:function(res){
                    alert(res.responseJSON.message);
                }
            })
        }else{
            alert("Two passwords do not match!!");
        }
    }else{
        alert("Please enter the full registration content!");
    }
}

function login(){
    var username=$("#username").val();
    var password=$("#password").val();
    if(username!=""&&password!="" ){
        $.ajax({
            url:http+"/login",
            method:"POST",
            data:{"username":username,"password":password},
            success:function(res){
                console.log(res);
                if(res.status_code==200){
                    alert(res.message);
                    localStorage.setItem("token",res.data.token);
                    window.location.href="/";
                }else{
                    alert(res.message);
                }
            },error:function(res){
                alert(res.responseJSON.message);
            }
        })
    }else{
        alert("Please enter the full login content!");
    }
}


function comment(mid){
    var message= $("#message").val();
    var date=new Date();
    var nowdate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    if(message!=""){
        $.ajax({
            headers: { 
                "Authorization":"Bearer "+token,
            },
            url:http+"/comment",
            type:"POST",
            data:{content:message,start_time:nowdate,mid:mid},
            success:function(res){
                if(res.status_code==200){
                    alert(res.message);
                    window.location.reload();
                }
            },
            error:function(res){
               alert(res.responseJSON.message);
            }
        });
    }else{
        alert("Comment content cannot be empty!");
    }
}