import EmbedView from './EmbedView';

const getExtension = url => new URL(url).pathname.split('.').pop();

const VideoView = EmbedView.extend({

  getImage() {
    let video = $('<video />').attr({
      autoplay: true,
      loop: true,
      muted: true,
      poster: this.options.poster || ''
    });

    this.options.sources.forEach(url => {
      video.append(
        $('<source />').attr({
          href: url,
          type: `video/${getExtension(url)}`
        })
      );
    });

    return video;
  },

  render() {
    this._super();

    this.$video = this.getImage();
    this.$embed.append(this.$video);

    this.$video.on('load', () => {
      this.trigger('load');
    });

    return this;
  }
});

export default VideoView;
