const { ipcRenderer } = require('electron');

function ids(value) {
  return (value || '').split(/\s+/).filter(Boolean);
}

function collect(button) {
  const values = {};
  for (const id of ids(button.dataset.collect)) {
    const element = document.getElementById(id);
    if (element && typeof element.value === 'string') {
      values[id] = element.value;
    }
  }
  return values;
}

function send(action, values) {
  ipcRenderer.send('dialog:action', action, values);
}

function press(action) {
  const button = document.querySelector('[data-action="' + action + '"]');
  if (button && !button.disabled) {
    button.click();
  }
}

function updateRequirements() {
  for (const button of document.querySelectorAll('[data-require]')) {
    const filled = ids(button.dataset.require).every((id) => {
      const element = document.getElementById(id);
      return element && typeof element.value === 'string' && element.value.trim() !== '';
    });
    button.disabled = !filled;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  for (const button of document.querySelectorAll('[data-action]')) {
    button.addEventListener('click', () => send(button.dataset.action, collect(button)));
  }

  for (const button of document.querySelectorAll('[data-require]')) {
    for (const id of ids(button.dataset.require)) {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', updateRequirements);
        element.addEventListener('change', updateRequirements);
      }
    }
  }

  for (const element of document.querySelectorAll('[data-enter]')) {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') press(element.dataset.enter);
    });
  }

  for (const element of document.querySelectorAll('[data-dblclick]')) {
    element.addEventListener('dblclick', () => press(element.dataset.dblclick));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') send('cancel', {});
  });

  updateRequirements();
});

// Головний процес надсилає дані для заповнення списків: { idЕлемента: [рядки] }
ipcRenderer.on('dialog:init', (_event, fill) => {
  for (const [id, items] of Object.entries(fill || {})) {
    const element = document.getElementById(id);
    if (!element || !Array.isArray(items)) continue;
    for (const item of items) {
      const option = document.createElement('option');
      option.textContent = String(item);
      element.appendChild(option);
    }
  }
  updateRequirements();
});