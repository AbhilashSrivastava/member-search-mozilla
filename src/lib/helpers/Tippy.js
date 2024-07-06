import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

/**
* TippyJs is a tooltip library which will be used to show the user available shortcuts,
* for out features. This will be used on i button on the screen. 
* We are not using the library directly but we are tranforming it in such a way to be used
* inside a svelte component
*/
export default function (node, options) {
  // Create a Tippy instance
  const instance = tippy(node, options);

  return {
    /**
     * Updates the Tippy instance with new options.
     * @param {Object} newOptions - The new options to update the Tippy instance with.
     */
    update(newOptions) {
      instance.setProps(newOptions);
    },
    /**
     * Destroys the Tippy instance.
     */
    destroy() {
      instance.destroy();
    }
  };
}