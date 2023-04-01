import Geohash from './latlon-geohash.js';
var ipinfo_token="9848aa40244e7e";
var google_token="AIzaSyCxbFjl3u_TVjgZB0QPTlgOigN3INrkzjI";
var ip="";
$(function(){
    $(".errorBox").hide();
    $("#myTable").hide();
    $(".body_box").hide();
    $("#show_box").hide();
    $('#keyword').val();
    $("#AutoDetectLocation").change(function(event){
        var bl=event.currentTarget.checked;
        if(bl){
            $("#locations").hide();
            $.ajax({
                url:"https://api.ipify.org/?format=json",
                method:"get",
                success:function(res){
                    ip=res.ip;
                    $.ajax({
                        url:"https://ipinfo.io/"+ip+"?token="+ipinfo_token,
                        method:"get",
                        success:function(address){
                            $("#locations").val(address.city);
                        }
                    })
                }
            });
        }else{
            $("#locations").val("");
            $("#locations").show();
        }
    });




    $("#search").click(function(){
        $(".errorBox").hide();
        $("#myTable").hide();
        $(".body_box").hide();
        var keyword=$('#keyword').val();
        var distance=$('#distance').val();
        var category=$('#category').val();
        var location=$('#locations').val();
        if(keyword=="" || keyword==null){
            $('#keyword').tooltip('show');
            setTimeout(function(){
                $('#keyword').tooltip('hide');
            },2000);
        }else if(location=="" || location==null){
            $('#locations').tooltip('show');
            setTimeout(function(){
                $('#locations').tooltip('hide');
            },2000);
        }else{
            if(distance=="" || distance==null){
                distance=10;
            }
            $.ajax({
                url:"https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key="+google_token,
                method:"get",
                success:function(res){
                  const geohash = Geohash.encode(res.results[0].geometry.location.lat,res.results[0].geometry.location.lng, 7);
                  $.ajax({
                    url:"/search?keyword="+keyword+"&distance="+distance+"&category="+category+"&geoPoint="+geohash,
                    method:"get",
                    success:function(data){
                        console.log(data);
                        if(data.code.code==200){
                            var dataList=data.dataList;
                            $("#myTable").show();
                            $('#myTable').DataTable({
                                'destroy':true,
                                'data': dataList,
                                 columns: [
                                    { data: 'Date' },
                                    { data: 'Icon',render:function(event){
                                        return "<img src='"+event+"' />"
                                    }},
                                    { data: 'Event' },
                                    { data: 'Genre' },
                                    { data: "Venue" }
                                ]
                            });
                            var i=0;
                            dataList.forEach(element => {
                               $("#tbody").children(i).attr("class","event");
                               $("#tbody").children().eq(i).attr("onclick","eventClick('"+element.Id+"')");
                               i++;
                            });
                        }else{
                            $(".errorBox").show();
                            $(".errorBox").html(data.code.message);
                        }
                    }
                  });
                }
            });
        }
    });

    $("#clear").click(function(){
        $("#forms")[0].reset();
    });

});

