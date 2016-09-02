import EmbedView from './EmbedView';
import $ from 'jquery';

const ImageView = EmbedView.extend({
  className: 'extplug-chat-image',

  getImage() {
    return $('<img />')
      .attr('alt', this.options.url)
      .attr('src', this.options.url);
  },

  render() {
    this._super();

    this.$image = this.getImage();
    this.$embed.append(this.$image);

    this.$image.on('load', () => {
      this.resize();
      this.trigger('load');
    });

    return this;
  }

});

export default ImageView;
