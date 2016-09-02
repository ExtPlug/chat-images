import $ from 'jquery';
import { View } from 'backbone';

const EmbedView = View.extend({
  className: 'extplug-chat-image',

  render() {
    this.$close = $('<div />')
      .addClass('extplug-close')
      .append($('<i />').addClass('icon icon-dialog-close'));

    this.$embed = $('<div />')
      .addClass('extplug-chat-image-embed');

    this.$el
      .empty()
      .append(this.$close)
      .append(this.$embed);

    this.$close.on('click', e => {
      // ctrl+click closes all
      if (e.ctrlKey) {
        $('#chat-messages .extplug-chat-image .extplug-close').click();
      }
      else {
        this.close();
      }
    });

    return this;
  },

  resize() {
    let w = this.$link.width();
    if (w < this.$el.width()) {
      // keep things at least 30px wide so the close icon fits in the message
      this.$el.width(Math.max(w, 30));
    }
  },

  close() {
    this.destroy();
    this.$embed = null;
    this.$close = null;
  }

});

export default EmbedView;
