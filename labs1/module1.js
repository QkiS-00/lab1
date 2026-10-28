const { openDialog } = require('./utils');

const GROUPS = ['ІМ-51', 'ІМ-52', 'ІМ-53', 'ІМ-54', 'ІМ-55', 'ІМ-51о'];

const MARKUP = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
  <style>
    body { font-family: sans-serif; margin: 14px; }
    select { width: 100%; margin: 8px 0 12px; }
    .buttons { text-align: right; }
    button { min-width: 80px; margin-left: 6px; }
  </style>
</head>
<body>
  <div>Оберіть групу:</div>
  <select id="list" size="8" data-dblclick="ok"></select>
  <div class="buttons">
    <button data-action="ok" data-collect="list" data-require="list" disabled>Так</button>
    <button data-action="cancel">Відміна</button>
  </div>
</body>
</html>`;

function show(parent, onResult) {
  openDialog({
    parent,
    title: 'Робота1',
    width: 320,
    height: 300,
    markup: MARKUP,
    fill: { list: GROUPS },
    actions: {
      ok: (values, dialog) => {
        if (!values.list) return;
        onResult(values.list);
        dialog.close();
      },
      cancel: (values, dialog) => {
        dialog.close();
      }
    }
  });
}

module.exports = { show };