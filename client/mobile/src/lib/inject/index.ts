/**
 * 生成注入到Webview中的js代码
 */
export function generateInjectScript() {
  // console.log(require('../../../dist/plugins/com.msgbyte.env.rn/index.js'));

  return `alert(JSON.stringify(window.tailchat))`;
}
