function search(){
    var test=$("#texts").val();
    if(test!=null && test!=""){
        window.location.href="/search/"+test;
    }else{
        alert("The query content cannot be empty");
    }
}