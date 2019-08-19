<template>
  <div id="container">
    <div id="message">
    </div>
    <div>
      <input id="text" type="text" placeholder="输入内容..."/>
      <button onclick="send()">发送消息</button>
      <input id="sessionId" type="hidden" value="<%=JSESSIONID%>"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chart',
  data(){
    return {
      websocket:null,
    }
  },
  created(){
    this.buildWebSocket();    //新建一个websocket
  },
  mounted(){
    this.initWebsocket();    //websocket的回调函数
  },
  beforeDestroy(){
    this.onbeforeunload();     //监听窗口关闭事件

  },
  methods:{
    //新建一个websocket
    buildWebSocket(){
      //判断当前浏览器是否支持WebSocket
      if('WebSocket' in window){
        //获取服务器ip地址
        let url = '';
        let host = window.location.host;
        let param = this.GetQueryString("X-trustagw-access-token");
        if (param == null) { //如果url中没有传X-trustagw-access-token，则传sessionId
          let sessionId = document.getElementById('sessionId').value;
          console.log("sessionId:"+sessionId);
          if(typeof(sessionId) !== undefined){
            url = "wss://" + host + "/webSocketProxy?sessionId=" + sessionId;
          }
        }else{
          url = "wss://" + host + "/webSocketProxy?X-trustagw-access-token=" + param;
        }
        console.log("url:"+url);
        this.websocket = new WebSocket(url);
      }else{
          alert('当前浏览器不支持websocket');
      }
    },
    GetQueryString(name){
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    //websocket的回调函数
    initWebsocket(){
      this.websocket.onmessage=this.websocketonmessage;   //接收到消息的回调方法
      this.websocket.onopen=this.websocketonopen;         //连接成功建立的回调方法
      this.websocket.onclose=this.websocketonclose;       //连接关闭的回调方法
      this.websocket.onerror=this.websocketonerror;       //连接发生错误的回调方法
    },

    //发送消息
    send() {
      let message = document.getElementById('text').value;
      this.websocket.send(message);
    },

    //接收到消息的回调方法
    websocketonmessage(event) {
      var data = event.data;
      document.getElementById('message').innerHTML += data + '<br/>';
    },

    //连接成功建立的回调方法
    websocketonopen() {
      console.log("onopen...");
    },
    //连接关闭的回调方法
    websocketonclose() {
      console.log("onclose...");
    },
    //连接发生错误的回调方法
    websocketonerror() {
      console.log("onerror...");
    },
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    onbeforeunload() {
      alert(1);
      this.closeWebSocket();
    },

    //关闭WebSocket连接
    closeWebSocket() {
      this.websocket.close();
    }
  },
}
</script>

<style scoped>
  #message {
    height: 520px;
    border-bottom: 1px solid gray;
    padding: 20px 30px;
  }

  #container {
    margin: 0 auto;
    width: 720px;
    border: 1px solid gray
  }

  input {
    width: 300px;
    height: 36px;
    border: 1px solid gray;
    background: none;
    outline: none;
  }

  input:focus {
    border-color: yellow;
  }

  button {
    height: 36px;
  }
</style>
