import $ from 'jquery';
import { View } from 'backbone';

const EmbedView = View.extend({
  className: 'extplug-chat-image',

  render() {
    this.$close = $('<div />')
      .addClass('extplug-close')
      .append($('<i />').addClass('icon icon-dialog-close'));

    this.$link = $('<a />')
      .attr('href', this.options.url)
      .attr('title', this.options.url)
      .attr('target', '_blank');

    this.$el
      .empty()
      .append(this.$close)
      .append(this.$link);

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
    this.$link.text(this.options.url);
    this.$el.replaceWith(this.$link);
    this.destroy();
    this.$link = null;
    this.$close = null;
  }

});

export default EmbedView;
