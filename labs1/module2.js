const { openDialog } = require('./utils');

const MARKUP = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
  <style>
    body { font-family: sans-serif; margin: 14px; }
    input { width: 100%; box-sizing: border-box; margin: 8px 0 16px; padding: 4px; }
    .buttons { text-align: right; }
    button { min-width: 80px; margin-left: 6px; }
  </style>
</head>
<body>
  <div>Введіть текст:</div>
  <input id="edit" type="text" autofocus data-enter="ok">
  <div class="buttons">
    <button data-action="ok" data-collect="edit" data-require="edit" disabled>Так</button>
    <button data-action="cancel">Відміна</button>
  </div>
</body>
</html>`;

function show(parent, onResult) {
  openDialog({
    parent,
    title: 'Робота2',
    width: 340,
    height: 160,
    markup: MARKUP,
    actions: {
      ok: (values, dialog) => {
        if (!values.edit || values.edit.trim() === '') return;
        onResult(values.edit);
        dialog.close();
      },
      cancel: (values, dialog) => {
        dialog.close();
      }
    }
  });
}

module.exports = { show };