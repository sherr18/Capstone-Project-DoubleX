$(function(){
     $("#show_box").hide();
     $("#details_box").hide();
});

function eventClick(id){
    $.ajax({
        url:"/search/"+id,
        method:"get",
        success:function(res){
            console.log(res);
            $("#show_box").show();
            $(".body_box").show();
            $("#priceRangesBox").hide();
            $("#DetailName").html(res.Name);
            $("#date").html(res.Date);
            if(res.Attractions!=null){
                var attractions="";
                res.Attractions.forEach(element => {
                   attractions+=
                        "<a href='"+element.url+"' target='_blank'>"+
                        "<span>"+element.name+"</span>"+
                        "</a>"+"<span style='margin-left:0.5vw;margin-right:0.5vw;'>|</span> ";
                });
                $("#attractions").html(attractions);
            }
            $("#venue").html(res.Venue);
            if(res.Classifications!=null){
                var genre="";
                res.Classifications.forEach(element => {
                    genre+=element.name+"<span style='margin-left:0.5vw;margin-right:0.5vw;'>|</span> "
                });
                $("#genre").html(genre);
            }
            if(res.PriceRanges!=null){
                 $("#priceRangesBox").show();
                 $("#priceRanges").html(res.PriceRanges);
            }
            if(res.TicketStatus=="onsale"){
                $("#ticketStatus").html("On sale");
                $("#ticketStatus").css("background","Green");
            }else if(res.TicketStatus=="offsale"){
                $("#ticketStatus").html("Off sale");
                $("#ticketStatus").css("Red","Green");
            }else if(res.TicketStatus=="canceled"){
                $("#ticketStatus").html("Canceled");
                $("#ticketStatus").css("background","Black");
            }else if(res.TicketStatus=="postponed"){
                $("#ticketStatus").html("Postponed");
                $("#ticketStatus").css("background","Orange");
            }else if(res.TicketStatus=="rescheduled"){
                $("#ticketStatus").html("Rescheduled");
                $("#ticketStatus").css("background","Orange");
            }
            $("#ticketAt").attr("href",res.TicketmasterUrl);
            $("#map").attr("src",res.SeatMap);
            $("#show_box").attr("onclick","venuesClick('"+res.DetailsName+"')");
        }
    })
}

function venuesClick(keyword){
    $("#show_box").hide();
    $.ajax({
        url:"/venue/"+keyword,
        method:"get",
        success:function(res){
            $("#details_box").show();
            var name=res.name;
            var address=res.address;
            var city=res.cityName+","+res.stateCode
            var postalCode=res.postalCode;
            var upcomingEvents=res.upcomingEvents;
            var googleurl=res.googleurl;
            $("#details_name").html(name);
            $("#details_address").html(address+"<br/>"+city+"<br/>"+postalCode+"<br/>");
            $("#details_venue").attr("href",upcomingEvents);
            $("#details_google").attr("href",googleurl);
        }
    });
}