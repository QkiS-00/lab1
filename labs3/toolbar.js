export class Toolbar {
  constructor(element, onSelect) {
    this.element = element;
    this.onSelect = onSelect;
    this.buttons = Array.from(element.querySelectorAll('button[data-shape]'));
    element.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(event) {
    const button = event.target.closest('button[data-shape]');
    if (!button || !this.element.contains(button)) return;
    this.onSelect(button.dataset.shape);
  }

  onNotify(type) {
    for (const button of this.buttons) {
      const active = button.dataset.shape === type;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
}