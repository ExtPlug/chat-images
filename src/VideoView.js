import EmbedView from './EmbedView'

const getExtension = url => new URL(url).pathname.split('.').pop()

const VideoView = EmbedView.extend({

  getImage() {
    this.$video = $('<video />').attr({
      autoplay: true,
      loop: true,
      muted: true,
      poster: this.options.poster || ''
    })

    this.options.sources.forEach(url => {
      this.$video.append(
        $('<source />').attr({
          href: url,
          type: `video/${getExtension(url)}`
        })
      )
    })

    return this.$video
  }
})

export default VideoView
