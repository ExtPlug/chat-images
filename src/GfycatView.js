import EmbedView from './EmbedView';
import { json as get } from 'extplug/util/request';
import $ from 'jquery';

const GfycatView = EmbedView.extend({

  initialize() {
    this.options.sources = [];
  },

  getThumbUrl() {
    return `https://thumbs.gfycat.com/${this.options.name}-poster.jpg`;
  },

  getVideo({ mp4Url, webmUrl }) {
    return $('<video />')
      .attr({
        autoplay: true,
        loop: true,
        muted: true,
        poster: this.getThumbUrl()
      })
      .append(
        $('<source />').attr({
          href: webmUrl.replace(/^http:/, 'https:'),
          type: 'video/webm'
        }),
        $('<source />').attr({
          href: mp4Url.replace(/^http:/, 'https:'),
          type: 'video/mp4'
        })
      );
  },

  render() {
    this._super();

    get(`https://gfycat.com/cajax/get/${this.options.name}`).then(json => {
      this.$video = this.getVideo(json.gfyItem);
      this.$embed.append(this.$video);

      this.$video.on('load', () => {
        this.trigger('load');
      })
    }).fail(() => this.remove());

    return this;
  }

});

export default GfycatView;
