// 注入加载层 HTML 到 <body> 开头
hexo.extend.injector.register('body_begin', () => `
  <div class="spinner" id="eloading">
    <div class="loader-text">0%</div>
    <div class="loader"></div>
    <div class="loader-text-below">全力加载中...(╯▔皿▔)╯</div>
  </div>
`);

// 注入 CSS 到 <head> 末尾
hexo.extend.injector.register('head_end', () => `
  <link rel="stylesheet" href="https://static.hzchu.top/lxgw-wenkai-screen-webfont@1.1.0/lxgwwenkaiscreen.css" media="all">
  <link rel="stylesheet" href="/mcss/mcss.css">
  <style>
  body.noscroll { overflow: hidden; }
  .spinner {
    position: fixed; top: 0; right: 0; bottom: 0; left: 0;
    background-color: rgba(249, 250, 251, 0.95);
    z-index: 9999;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
  }
  .loader-text { margin-bottom: 20px; color: #333; }
  .loader {
    --height-of-loader: 4px;
    --loader-color: #744DA9;
    width: 130px; height: var(--height-of-loader);
    border-radius: 30px;
    background-color: rgba(0,0,0,0.2);
    position: relative;
  }
  .loader-text-below { margin-top: 20px; color: #666; cursor: pointer; }
  .loader::before {
    content: ""; position: absolute; top: 0; left: 0;
    width: var(--width, 0%); height: 100%;
    background: var(--loader-color);
    border-radius: 30px;
    transition: width 0.5s ease-in-out;
  }
  </style>
`);

// 注入 load.js 到 </body> 之前（确保 DOM 已存在）
hexo.extend.injector.register('body_end', () => `
  <script src="/js/load.js"></script>
`);