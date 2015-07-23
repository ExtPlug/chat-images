import Plugin from 'extplug/Plugin'
import Events from 'plug/core/Events'
import chatFacade from 'plug/facades/chatFacade'
import * as embedders from './embedders'
import ImageView from './ImageView'
import VideoView from './VideoView'
import styles from './style'
import { each, uniqueId } from 'underscore'
import { around } from 'meld'
import $ from 'jquery'

const embedSymbol = Symbol('images')

const ChatImages = Plugin.extend({
  name: 'Chat Images',
  description: 'Embeds chat images in chat.',

  commands: {
    collapse: 'closeAll'
  },

  init(id, ext) {
    this._super(id, ext)
    this.closeAll = this.closeAll.bind(this)
  },

  enable() {
    this.advice = around(chatFacade, 'parse', joinpoint => {
      // only intercept parse() calls that are actually used for chat
      if (joinpoint.args.length > 1) {
        let msg = joinpoint.args[1]
        this.onBeforeReceive(msg)
        return joinpoint.proceed(msg.message, msg, joinpoint.args[2])
      }
      return joinpoint.proceed()
    })
    Events.on('chat:afterreceive', this.onAfterReceive, this)
    this.Style(styles)
  },

  disable() {
    this.advice.remove()
    Events.off('chat:afterreceive', this.onAfterReceive)
  },

  addEmbed(msg, url, view) {
    const id = uniqueId('embed')
    msg[embedSymbol].push({
      id: id,
      url: url,
      view: view
    })
    return `<i id="${id}"></i>`
  },

  closeAll() {
    $('#chat-messages .extplug-chat-image .extplug-close').click()
  },

  onBeforeReceive(msg) {
    msg[embedSymbol] = []

    msg.message = msg.message.replace(embedders.generic, url => {
      return this.addEmbed(msg, url, new ImageView({ url: url }))
    })

    msg.message = msg.message.replace(embedders.webm, url => {
      return this.addEmbed(msg, url, new VideoView({
        url: url,
        sources: [ url ]
      }))
    })

    msg.message = msg.message.replace(embedders.gifv, url => {
      const path = url.split('.').slice(0, -1).join('.')
      return this.addEmbed(msg, url, new VideoView({
        url: url,
        poster: `${path}.jpg`,
        sources: [ `${path}.webm`, `${path}.mp4` ]
      }))
    })
  },
  onAfterReceive(msg, el) {
    if (msg[embedSymbol]) {
      msg[embedSymbol].forEach(embed => {
        el.find(`#${embed.id}`).replaceWith(embed.view.$el)
        embed.view.once('load', this.checkScroll, this)
        embed.view.render()
      })
    }
  },

  checkScroll() {
    let msg = $('#chat-messages')
    let shouldScroll = msg.scrollTop() > (msg[0].scrollHeight - msg.height() - msg.children().last().height())
    if (shouldScroll) {
      msg.scrollTop(msg[0].scrollHeight)
    }
  }

})

export default ChatImages
