/**
 * 注入 nightly 分析脚本
 *
 * 请确保该脚本仅在nightly环境下生效
 *
 * 目前在github 构建action中使用
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../assets/template.html');

// frontjs
// const script = `<script type="text/javascript">(function (w) {w.frontjsConfig={token:"acd42b4b4e2b2a9fa33b36e9cd60e866",behaviour:15,captureConsoleLog:true,trustVendor:true,ignoreVendor:true,optimisedForSPA:true,useHistory:true,FPSThreshold:10};w.frontjsTmpData = {r:[],e:[],l:[]};w.frontjsTmpCollector = function (ev) {(ev.message ? window.frontjsTmpData.e : window.frontjsTmpData.r).push([new Date().getTime(), ev])};w.FrontJS = {addEventListener: function (t, f) {w.frontjsTmpData.l.push([t, f]);return f;},removeEventListener: function (t, f) {for (var i = 0; i < w.frontjsTmpData.l.length; i++) {t === w.frontjsTmpData.l[i][0] && f === w.frontjsTmpData.l[i][1] && w.frontjsTmpData.l.splice(i, 1);}return f;}};w.document.addEventListener("error", w.frontjsTmpCollector, true);w.addEventListener("error", w.frontjsTmpCollector, true);w.addEventListener("load", function () {var n = w.document.createElement("script");n.src = "https://frontjs-static.pgyer.com/dist/current/frontjs.web.min.js"; w.document.body.appendChild(n);}, true);})(window);</script>`;
// umami
const script = `<script async defer data-website-id="550cf175-3bd2-4292-b0a8-ccdf85f7b807" src="https://umami.moonrailgun.com/script.js"></script>`;

console.log('templatePath', templatePath);
let template = fs.readFileSync(templatePath, {
  encoding: 'utf-8',
});
template = template.replace('</head>', script + '</head>');

fs.writeFileSync(templatePath, template);
