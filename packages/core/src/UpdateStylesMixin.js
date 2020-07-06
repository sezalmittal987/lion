/* global ShadyCSS */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('../types/UpdateStylesMixinTypes').UpdateStylesMixin} UpdateStylesMixin
 * @typedef {import("lit-element").LitElement} LitElement
 */

/** @type {UpdateStylesMixin} */
const UpdateStylesMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow
  class UpdateStylesMixinHost extends superclass {
    /**
     * @example
     * <my-element>
     *     <style>
     *         :host {
     *          color: var(--foo);
     *         }
     *     </style>
     * </my-element>
     *
     * $0.updateStyles({'background': 'orange', '--foo': '#fff'})
     * Chrome, Firefox: <my-element style="background: orange; --foo: bar;">
     * IE: <my-element>
     *     => to head: <style>color: #fff</style>
     *
     * @param {Object.<string, string>} updateStyles
     */
    updateStyles(updateStyles) {
      const styleString = this.getAttribute('style') || this.getAttribute('data-style') || '';

      /**
       * reducer function
       * @param {Object.<string, any>} acc
       * @param {string} stylePair
       */
      const reducer = (acc, stylePair) => {
        /** @type {Array.<string>} */
        const parts = stylePair.split(':');
        if (parts.length === 2) {
          // eslint-disable-next-line prefer-destructuring
          acc[parts[0]] = parts[1];
        }
        return acc;
      };
      const currentStyles = styleString.split(';').reduce(reducer, {});

      const newStyles = { ...currentStyles, ...updateStyles };
      let newStylesString = '';
      // @ts-ignore not sure how to type ShadyCSS..
      if (typeof ShadyCSS === 'object' && !ShadyCSS.nativeShadow) {
        // No ShadowDOM => IE, Edge

        /** @type {Object.<string, any>} */
        const newCssVariablesObj = {};

        Object.keys(newStyles).forEach(key => {
          if (key.indexOf('--') === -1) {
            newStylesString += `${key}:${newStyles[key]};`;
          } else {
            newCssVariablesObj[key] = newStyles[key];
          }
        });
        this.setAttribute('style', newStylesString);
        // @ts-ignore not sure how to type ShadyCSS..
        ShadyCSS.styleSubtree(this, newCssVariablesObj);
      } else {
        // has shadowdom => Chrome, Firefox, Safari
        Object.keys(newStyles).forEach(key => {
          newStylesString += `${key}: ${newStyles[key]};`;
        });
        this.setAttribute('style', newStylesString);
      }
    }
  };

export const UpdateStylesMixin = /** @type {UpdateStylesMixin} */ (dedupeMixin(
  // not sure how to strict type this 😅
  // @ts-ignore
  UpdateStylesMixinImplementation,
));
