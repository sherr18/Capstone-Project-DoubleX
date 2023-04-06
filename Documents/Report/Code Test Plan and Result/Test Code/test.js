const expect = require('chai').expect;
const {API_URL,Py_URL,userInfo,movie} =require("./test_util");
const axios=require("axios");

describe("test", async() => {
    describe("Displays the TMDB movie information page:", async() => {
        it("Open the home page", async() => {
            const home=await axios({
                url:API_URL+"/",
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(home.status).to.be.equal(200);
        });
        it("Open the Popular Recommended Movies List page", async() => {
            const popularList=await axios({
                url:API_URL+"/popularList",
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(popularList.status).to.be.equal(200);
        });
        it("Open the Popular Recommended Movies Detail page", async() => {
            const proplueDetail=await axios({
                url:API_URL+"/proplue?proplue_id="+movie.proplue_id,
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(proplueDetail.status).to.be.equal(200);
        });
        it("Open the movie search information page and search for information", async() => {
            const searchMovie=await axios({
                url:API_URL+"/search/"+movie.search_name,
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(searchMovie.status).to.be.equal(200);
        });
        
        it("Open the Movies Detail page", async() => {
            const movieDetail=await axios({
                url:API_URL+"/movie?movie_id="+movie.movie_id,
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(movieDetail.status).to.be.equal(200);
        });
    });

    describe("Test the login and registration functions:", async() => {
        it("Test registration function:", async() => {
            const login=await axios({
                url:Py_URL+"/register",
                method:"POST",
                data:{username:userInfo.username,password:userInfo.password},
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(login.data.message).to.be.equal("Registered user successfully");
            expect(login.data.status_code).to.be.equal(200);
        });
        it("Test login function:", async() => {
            const login=await axios({
                url:Py_URL+"/login",
                method:"POST",
                data:{username:userInfo.username,password:userInfo.password},
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(login.data.message).to.be.equal("successfully login");
            expect(login.data.status_code).to.be.equal(200);
        });
    });


    describe("Test comment function:", async() => {
        it("Query all reviews of the current movie:", async() => {
            const movieDetail=await axios({
                url:Py_URL+"/comments/"+movie.movie_id,
                method:"get",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            expect(movieDetail.data.message).to.be.equal("successfully");
            expect(movieDetail.data.status_code).to.be.equal(200);
        });

        it("Test the new comment feature:", async() => {
            var date=new Date();
            var nowdate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            const login=await axios({
                url:Py_URL+"/login",
                method:"POST",
                data:{username:userInfo.username,password:userInfo.password},
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
            });
            const commentAdd=await axios({
                url:Py_URL+"/comment",
                method:"POST",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    "Authorization":"Bearer "+login.data.data.token,
                },
                data:{mid:movie.movie_id,content:"test comment",start_time:nowdate}
            });
            expect(commentAdd.data.message).to.be.equal("successfully comment");
            expect(commentAdd.data.status_code).to.be.equal(200);
        });
    });

});