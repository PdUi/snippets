/*
 * https://developer.mozilla.org/en-US/docs/Web/Web_Components
 * https://github.com/webcomponents/gold-standard/wiki
 * https://github.com/GoogleChromeLabs/file-drop/blob/master/lib/filedrop.ts
 */
class GettingStartedElement extends HTMLElement {
    constructor() {
        // establish prototype chain
        super();

        // creating a container for the component
        //const containerElement = document.createElement('div');

        // attaches shadow tree and returns shadow root reference
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
        // const shadow = this.containerElement.attachShadow({ mode: 'open' });

        // to style container element can do that with
        // this.innerHTML = '<style>:host { width: 10px; }</style>
        // creating the inner HTML of the element
        this.innerHTML = `
        <style>
          my-element {
            background-color: tomato;
            display: block;
            height: 10px;
            width: 10px;
          }
        </style>
      `;

      // shadow.appendChild(this.containerElement);
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
        this.addEventListener('click', evt => console.log(evt), false);
    }
}

// let the browser know about the custom element
customElements.define('pd-getting-started-element', GettingStartedElement);
