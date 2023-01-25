document.addEventListener('plusready', function () {
  console.log(
    '所有plus api都应该在此事件发生后调用，否则会出现plus is undefined。'
  );
  const w = plus.webview.create('https://nightly.paw.msgbyte.com/');
  w.show();

  const clientInfo = plus.push.getClientInfo();
  console.log('clientInfo', JSON.stringify(clientInfo));
});
