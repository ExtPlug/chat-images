import EmbedView from './EmbedView'

const ImageView = EmbedView.extend({
  className: 'extplug-chat-image',

  getImage() {
    return $('<img />')
      .attr('alt', this.options.url)
      .attr('src', this.options.url)
  },

  render() {
    this._super()

    this.$image = this.getImage()
    this.$link.append(this.$image)

    this.$image.on('load', () => {
      this.trigger('load')
    })

    return this
  }

})

export default ImageView
