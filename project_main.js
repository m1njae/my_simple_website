var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, description, control){
  return `
  <!doctype html>
  <html>
  <head>
    
    <style type="text/css">
      /* link - 아직 클릭하지 않은 경우 */
      a:link { color: black; text-decoration: none;}	
      /* visited - 한번 클릭하거나 전에 클릭한적 있을 경우 */
      a:visited { color: black; text-decoration: none;}	
      /* hover - 마우스를 해당 링크에 위치했을 경우  */
      a:hover { color: black; text-decoration: underline;}
    </style>

    <title>Welcome! ${title}</title>
    <meta charset="utf-8">

  </head>
  <body>
    <h1><a href="/">🙌안녕하세요, 강민재입니다!🙌</a></h1>

    <a href="https://velog.io/@m1njae">✍️Blog: 공부 기록공간✍️</a><br>
    <a href="https://github.com/m1njae/m1njae">🛠️Github: m1njae🛠️</a><br>
    <a href="https://www.instagram.com/_m1njae__/">😊Instagram😊</a><br>
    
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
    //쿼리스트링을 제목으로 바꾸어주는 부분
    var querytotitle = function(querydata){ 
      if(queryData.id === 'major'){
        title = '👨‍🏫Major 전공👨‍🏫';
      }else if(queryData.id === 'goal'){
        title = '😎2022년 목표😎';
      }else if(queryData.id === 'BasicChallenge'){
        title = '🔥22 Basic Challenge 진행 중!🔥';
      }
      return title;
    };
    
    //사진을 정상적으로 불러오는 부분
    if(_url_==='/minjae.jpg'){ //  url을 요청했을 경우 이미지를 가져온다
      fs.readFile('minjae.jpg', function(err, data){ // 이미지 파일을 읽어온다
      response.writeHead(200, {'Content-Type': 'image/jpeg'})
      response.end(data) // 브라우저로 이미지 파일을 보낸다.
      })
      return;
    }

    if(pathname === '/'){ 
      if(queryData.id === undefined){  
            var title = '소개';
            var description =`
            어느 날은 책 한 구절이 그립고, 어느 날은 노래 한 소절을 흥얼거립니다.<br> 손길이 닿아있는 공간을 좋아하고, 스포츠와 사람들을 사랑합니다.<br>
            프로그래밍을 목적이 아닌 수단으로써 사용하여 주어진 문제를 해결하는 사람이 되었으면 합니다.        
            <ul>
              <li><a href="?id=major">👨‍🏫Major 전공👨‍🏫</a></li>
              <li><a href="?id=goal">😎2022년 목표😎</a></li>
              <li><a href="?id=BasicChallenge">🔥22 Basic Challenge 진행 중!🔥</a></li>
            </ul>
            `;
            var template = templateHTML(title, description,
            `Life is always finding its own way`)
            response.writeHead(200);  
            response.end(template);
  
      }else {
          fs.readdir('./data', function(err, filelist){
           fs.readFile(`data/${queryData.id}`,'utf8', function(err, description){
            var title = `${querytotitle(queryData.id)}`;
            var template = templateHTML(title, description,
            `<br><a href='/update?id=${queryData.id}'>🙇‍♂️내용 수정하기🙇‍♂️</a> <a href = '/'>&nbsp홈으로🏠</a><br>Life is always finding its own way`)
            response.writeHead(200);  
            response.end(template);
         });
       });
      }  
    }else if(pathname === '/update'){
       fs.readdir('./data', function(err, filelist){
        fs.readFile(`data/${queryData.id}`,'utf8', function(err, description){
          var title = `${querytotitle(queryData.id)}`;
          var template = templateHTML(title,
          ` 
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">  
          <p>
              <textarea name ="description" placeholder="수정할 내용을 입력하세요." style="width:500px;height:150px;font-size:15px;">${description}</textarea>
          </p><p>
              <input type="submit"> <a href = '/?id=${queryData.id}'>&nbsp뒤로</a>
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
        var post = qs.parse(body);  //post 형식으로 전달된 정보받기
        var id = post.id;
        var description = post.description;
        fs.writeFile(`data/${id}`,description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${id}`}); // 3xx으로 시작된 코드는 리다이랙션
          response.end(); 
        })
      });  
    }
    else{
      // 페이지를 찾을 수 없습니다 
      response.writeHead(404,{'Content-Type': 'text/html; charset=UTF-8'});  
      response.end('🙅‍♂️페이지를 찾을 수 없습니다!🙅‍♂️');
    }
     
});
app.listen(3000);