import EmbedView from './EmbedView'
import $ from 'jquery'
import { Model } from 'backbone'
import Events from 'plug/core/Events'
import PreviewEvent from 'plug/events/PreviewEvent'

const YouTubeView = EmbedView.extend({

  getThumbUrl() {
    return `https://i.ytimg.com/vi/${this.options.id}/hqdefault.jpg`
  },
  getEmbedUrl() {
    // autoplay is ok because this is always triggered by a click
    return `https://www.youtube-nocookie.com/embed/${this.options.id}?autoplay=1`
  },

  getImage() {
    let image = $('<img />')
      .attr('alt', this.options.url)
      .attr('src', this.getThumbUrl())

    image.on('click', e => {
      e.preventDefault()

      if (this.options.settings.get('youTubePreview')) {
        Events.dispatch(new PreviewEvent(
          PreviewEvent.PREVIEW,
          new Model({
            format: 1,
            cid: this.options.id,
            author: 'ExtPlug',
            title: 'YouTube Video'
          })
        ))
      }
      else {
        let iframe = $('<iframe />')
          .attr('src', this.getEmbedUrl())
          .attr('width', '100%')
          .attr('height', image.height())
          .attr('frameborder', 0)

        image.replaceWith(iframe)
        if (this.$icon) this.$icon.remove()
      }
    })

    return image
  },

  render() {
    this._super()

    this.$image = this.getImage()
    this.$icon = $('<i />').addClass('icon icon-youtube-big')
    this.$link.append(this.$icon, this.$image)

    this.$image.on('load', () => {
      this.trigger('load')
    })

    this.$el.addClass('extplug-youtube-embed')

    return this
  }

})

export default YouTubeView
