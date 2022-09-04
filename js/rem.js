window.onload=function(){
  function remSize(){
    // 获取视口宽度
    let deviceWidth = document.documentElement.clientWidth || window.innerWidth
/*     if(deviceWidth >= 750){
      deviceWidth = 750
    } */
    if(deviceWidth <= 1200){
      deviceWidth = 1200
    }
    // 设置html根字号为视口宽度 30分之一 , 1rem = 1根字号
    document.documentElement.style.fontSize = (deviceWidth/30) + 'px'
    // 设置body字体，即整体字体大小为0.3rem
    document.querySelector("body").style.fontSize = 0.3 +'rem'
  }
  
  remSize() //进入页面首次调用
  // 监听窗口尺寸变化修改rem适配
  window.onresize=function(){
    remSize()
  }
}