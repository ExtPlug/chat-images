import Plugin from 'extplug/Plugin';
import Events from 'plug/core/Events';
import chatFacade from 'plug/facades/chatFacade';
import * as embedders from './embedders';
import ImageView from './ImageView';
import GfycatView from './GfycatView';
import VideoView from './VideoView';
import YouTubeView from './YouTubeView';
import style from './style.css';
import { each, uniqueId } from 'underscore';
import { around } from 'meld';
import $ from 'jquery';

function truncate(str, len) {
  if (str.length > len) {
    return `${str.slice(0, len - 3)}…`;
  }
  return str;
}

const embedSymbol = Symbol('images');

const ChatImages = Plugin.extend({
  name: 'Chat Images',
  description: 'Embeds chat images in chat.',

  settings: {
    youTube: {
      type: 'boolean',
      default: false,
      label: 'Embed YouTube Videos',
      description: 'Embeds Click-to-play YouTube Videos in the chat.'
    },
    youTubePreview: {
      type: 'boolean',
      default: false,
      label: 'Preview Videos',
      description: 'Opens YouTube Videos in a Preview dialog instead of embedding them directly.'
    }
  },

  style: style,

  commands: {
    collapse: 'closeAll'
  },

  init(id, ext) {
    this._super(id, ext);
    this.closeAll = this.closeAll.bind(this);
  },

  enable() {
    this.advice = around(chatFacade, 'parse', joinpoint => {
      // only intercept parse() calls that are actually used for chat
      if (joinpoint.args.length > 1) {
        let msg = joinpoint.args[1];
        this.onBeforeReceive(msg);
        return joinpoint.proceed(msg.message, msg, joinpoint.args[2]);
      }
      return joinpoint.proceed();
    });
    Events.on('chat:afterreceive', this.onAfterReceive, this);
  },

  disable() {
    this.advice.remove();
    Events.off('chat:afterreceive', this.onAfterReceive);
  },

  addEmbed(msg, url, view) {
    const id = uniqueId('embed');
    msg[embedSymbol].push({
      id: id,
      url: url,
      view: view
    });
    return `<i id="${id}"></i>`;
  },

  closeAll() {
    let closers = $('#chat-messages .extplug-chat-image .extplug-close');
    closers.click();
    API.chatLog(`Closed ${closers.length} embedded images!`);
  },

  onBeforeReceive(msg) {
    msg[embedSymbol] = [];

    msg.message = msg.message.replace(embedders.generic, url => {
      return this.addEmbed(msg, url, new ImageView({ url: url }));
    });

    msg.message = msg.message.replace(embedders.webm, url => {
      return this.addEmbed(msg, url, new VideoView({
        url: url,
        sources: [ url ]
      }));
    });

    msg.message = msg.message.replace(embedders.gifv, url => {
      const path = url.split('.').slice(0, -1).join('.');
      return this.addEmbed(msg, url, new VideoView({
        url: url,
        poster: `${path}.jpg`,
        sources: [ `${path}.webm`, `${path}.mp4` ]
      }));
    });

    msg.message = msg.message.replace(embedders.gfycat, (url, name) => {
      return this.addEmbed(msg, url, new GfycatView({ name: name }));
    });

    if (this.settings.get('youTube')) {
      msg.message = msg.message.replace(embedders.youTube, (url, id) => {
        return this.addEmbed(msg, url, new YouTubeView({
          url: url,
          id: id,
          // for live preview setting status
          settings: this.settings
        }));
      });
    }
  },
  onAfterReceive(msg, el) {
    if (msg[embedSymbol]) {
      msg[embedSymbol].forEach(embed => {
        let href = $('<a />')
          .text(truncate(embed.url, 50))
          .attr('href', embed.url)
          .attr('target', '_blank');

        el.find(`#${embed.id}`).replaceWith(href);
        embed.view.$el.insertAfter(href);

        embed.view.once('load', this.checkScroll, this);
        embed.view.render();
      });
    }
  },

  checkScroll() {
    let msg = $('#chat-messages');
    let shouldScroll = msg.scrollTop() > (msg[0].scrollHeight - msg.height() - msg.children().last().height());
    if (shouldScroll) {
      msg.scrollTop(msg[0].scrollHeight);
    }
  }

});

export default ChatImages;
