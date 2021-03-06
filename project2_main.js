var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'my_website'
});
db.connect();

function templateHTML(title, description, control){
  return `
  <!doctype html>
  <html>
  <head>
    
    <style type="text/css">

      a:link { color: black; text-decoration: none;}	
      a:visited { color: black; text-decoration: none;}	
      a:hover { color: black; text-decoration: underline;}
    </style>

    <title>Welcome! ${title}</title>
    <meta charset="utf-8">

  </head>
  <body>
    <h1><a href="/">๐์๋ํ์ธ์, ๊ฐ๋ฏผ์ฌ์๋๋ค!๐</a></h1>

    <a href="https://velog.io/@m1njae">โ๏ธBlog: ๊ณต๋ถ ๊ธฐ๋ก๊ณต๊ฐโ๏ธ</a><br>
    <a href="https://github.com/m1njae/m1njae">๐ ๏ธGithub: m1njae๐ ๏ธ</a><br>
    <a href="https://www.instagram.com/_m1njae__/">๐Instagram๐</a><br>
    
    <p><img src="minjae.jpg" width = "300" height ="350" ></p>
  
    <h2>${title}</h2>
    ${description}
    <br>
    ${control}
  </body>
  </html>
  `;
}

var app = http.createServer(function(request,response){
    var _url_ = request.url;
    var queryData = url.parse(_url_, true).query;
    var pathname = url.parse(_url_, true).pathname;
    var title = queryData.id;
    //์ฟผ๋ฆฌ์คํธ๋ง์ ์ ๋ชฉ์ผ๋ก ๋ฐ๊พธ์ด์ฃผ๋ ๋ถ๋ถ
    var querytotitle = function(querydata){ 
      if(queryData.id === 'major'){
        title = '๐จโ๐ซMajor ์ ๊ณต๐จโ๐ซ';
      }else if(queryData.id === 'goal'){
        title = '๐2022๋ ๋ชฉํ๐';
      }else if(queryData.id === 'BasicChallenge'){
        title = '๐ฅ22 Basic Challenge ์์ฃผ!๐ฅ';
      }
      return title;
    };
    
    //์ฌ์ง์ ์ ์์ ์ผ๋ก ๋ถ๋ฌ์ค๋ ๋ถ๋ถ
    if(_url_==='/minjae.jpg'){ //  url์ ์์ฒญํ์ ๊ฒฝ์ฐ ์ด๋ฏธ์ง๋ฅผ ๊ฐ์ ธ์จ๋ค
      fs.readFile('minjae.jpg', function(err, data){ // ์ด๋ฏธ์ง ํ์ผ์ ์ฝ์ด์จ๋ค
      response.writeHead(200, {'Content-Type': 'image/jpeg'})
      response.end(data) // ๋ธ๋ผ์ฐ์ ๋ก ์ด๋ฏธ์ง ํ์ผ์ ๋ณด๋ธ๋ค.
      })
      return;
    }

    if(pathname === '/'){ 
      if(queryData.id === undefined){  
            var title = '์๊ฐ';
            var description =`
            ์ด๋ ๋ ์ ์ฑ ํ ๊ตฌ์ ์ด ๊ทธ๋ฆฝ๊ณ , ์ด๋ ๋ ์ ๋ธ๋ ํ ์์ ์ ํฅ์ผ๊ฑฐ๋ฆฝ๋๋ค.<br> ์๊ธธ์ด ๋ฟ์์๋ ๊ณต๊ฐ์ ์ข์ํ๊ณ , ์คํฌ์ธ ์ ์ฌ๋๋ค์ ์ฌ๋ํฉ๋๋ค.<br>
            ํ๋ก๊ทธ๋๋ฐ์ ๋ชฉ์ ์ด ์๋ ์๋จ์ผ๋ก์จ ์ฌ์ฉํ์ฌ ์ฃผ์ด์ง ๋ฌธ์ ๋ฅผ ํด๊ฒฐํ๋ ์ฌ๋์ด ๋์์ผ๋ฉด ํฉ๋๋ค.        
            <ul>
              <li><a href="?id=major">๐จโ๐ซMajor ์ ๊ณต๐จโ๐ซ</a></li>
              <li><a href="?id=goal">๐2022๋ ๋ชฉํ๐</a></li>
              <li><a href="?id=BasicChallenge">๐ฅ22 Basic Challenge ์์ฃผ!๐ฅ</a></li>
            </ul>
            `;
            var template = templateHTML(title, description,
            `Life is always finding its own way`)
            response.writeHead(200);  
            response.end(template);
  
      }else {
       db.query(`SELECT * FROM topic`, function(error,topic){
         if(error){
           throw error;
         }
         db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error2,topic){
           if(error2){
             throw error2;
           }
           var title = `${querytotitle(queryData.id)}`;
           var template = templateHTML(title, topic[0].description,
           `<br><a href='/update?id=${queryData.id}'>๐โโ๏ธ๋ด์ฉ ์์ ํ๊ธฐ๐โโ๏ธ</a> <a href = '/'>&nbspํ์ผ๋ก๐ </a><br>Life is always finding its own way`)
           response.writeHead(200);  
           response.end(template);
         })
       })
      }  
    }else if(pathname === '/update'){
      db.query(`SELECT * FROM topic`, function(error, topic){ 
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error2,topic){
          if(error2){
            throw error2;
          }
          var title = `${querytotitle(queryData.id)}`;
          var template = templateHTML(title,
          ` 
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">  
          <p>
              <textarea name ="description" placeholder="์์ ํ  ๋ด์ฉ์ ์๋ ฅํ์ธ์." style="width:500px;height:150px;font-size:15px;">${topic[0].description}</textarea>
          </p><p>
              <input type="submit"> <a href = '/?id=${topic[0].id}'>&nbsp๋ค๋ก</a>
            </p>
          </form>    
          `,
          `<br>Life is always finding its own way`)
         response.writeHead(200);  
         response.end(template); 
       });
     }); 
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);  //post ํ์์ผ๋ก ์ ๋ฌ๋ ์ ๋ณด๋ฐ๊ธฐ
        db.query(`UPDATE topic SET description=? WHERE id=?`,[post.description,post.id],function(error,result){
        response.writeHead(302, {Location: `/?id=${post.id}`}); // 3xx์ผ๋ก ์์๋ ์ฝ๋๋ ๋ฆฌ๋ค์ด๋์
        response.end(); 
        })
      });
    }
    else{
      // ํ์ด์ง๋ฅผ ์ฐพ์ ์ ์์ต๋๋ค 
      response.writeHead(404,{'Content-Type': 'text/html; charset=UTF-8'});  
      response.end('๐โโ๏ธํ์ด์ง๋ฅผ ์ฐพ์ ์ ์์ต๋๋ค!๐โโ๏ธ');
    }
     
});
app.listen(3000);