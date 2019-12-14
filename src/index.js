import { html, render, directive } from 'lit-html';

const useState = (value) => {
  let node;

  const setValue = (val) => {
    value = val;
    node.setValue(val);
    node.commit();
  };

  return [() => value, directive(() => n => {
    if (node) { return; }
    node = n;
    setValue(value);
  })(), setValue]
}

const todoCompletedDirective = directive((todo) => (part) => {
  if (todo.completed) {
    setTimeout(() => {
      part.setValue('completed');
      part.commit();
      console.log('must change!');
    }, 5000);
    return;
  }
  part.setValue('');
});

const rootTemplate = context => html`
<input type="text" @keyup=${context.inputKeyupHandler} .value=${context.titleInputValue}>
<button ?disabled=${!context.titleInputValue} @click=${context.addTodoHandler}>Add Todo</button>
<div>${context.number.directive}</div>
<button @click=${() => context.number.set(context.number.get() + 1)}>CHANGE!</button>
<ul>
  ${context.todos.map(
  todo =>
    html`<li class=${todoCompletedDirective(todo)} @click=${() => context.todoToggleHandler(todo)}> ${todo.title} ${todo.completed}</li>`)
  }
</ul>
`;

class AppRoot extends HTMLElement {

  set titleInputValue(value) {
    this._updateScheduled = value;
    if (this._update) { this._update(); }
  }

  get titleInputValue() {
    return this._updateScheduled;
  }

  todoToggleHandler(todo) {
    todo.completed = !todo.completed;
    this._update();
  }

  inputKeyupHandler({ target: { value } }) {
    this.titleInputValue = value;
  }

  addTodoHandler() {
    this.todos = this.todos.concat({ title: this.titleInputValue, completed: false });
    this.titleInputValue = '';
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    let updateScheduled = false;
    this.titleInputValue = '';
    this.todos = [];


    const [getValue, numberDirective, setNumber] = useState(1000);
    this.number = {
      get: getValue,
      directive: numberDirective,
      set: setNumber
    };

    this._update = () => {
      if (updateScheduled) { return; }
      updateScheduled = true;

      Promise.resolve().then(() => {
        updateScheduled = false;
        render(rootTemplate(this), root, { eventContext: this });
      })
    };

    this._update();
  }

  connectedCallback() {
    console.log('Connected!');
  }
}

customElements.define('hg-root', AppRoot);