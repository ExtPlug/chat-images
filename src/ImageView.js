import EmbedView from './EmbedView'

const ImageView = EmbedView.extend({
  className: 'extplug-chat-image',

  getImage() {
    return $('<img />')
      .attr('alt', this.options.url)
      .attr('src', this.options.url)
  }
})

export default ImageView
