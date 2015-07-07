export default {

  '.extplug-chat-image': {
    'position': 'relative',

    '.extplug-close': {
      'position': 'absolute',
      'top': '3px',
      'right': '3px',
      'width': '30px',
      'height': '30px',
      'display': 'none',
      'z-index': 30,
      'opacity': '0.5',
      'cursor': 'pointer'
    },
    '.extplug-close:hover': {
      'opacity': 1
    }
  },

  '.extplug-chat-image:hover': {
    '.extplug-close': {
      'display': 'block'
    }
  },

  '.extplug-chat-image img, .extplug-chat-image video': {
    'max-width': '100%',
    'max-height': '300px',
    'z-index': 10
  }

}