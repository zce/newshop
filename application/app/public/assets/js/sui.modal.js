/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#modals
 * =========================================================
 * @file bootstrap-modal.js
 * @brief 弹层dpl，扩展自bootstrap2.3.2
 * @author banbian, zangtao.zt@alibaba-inc.com
 * @date 2014-01-14
 */

!function ($) {
  "use strict";
 /* MODAL CLASS DEFINITION
  * ====================== */
  var Modal = function (element, options) {
    this.options = options
    //若element为null，则表示为js触发的alert、confirm弹层
    if (element === null) {
      var TPL = ''
        //data-hidetype表明这类简单dialog调用hide方法时会从文档树里删除节点
        + '<div class="sui-modal hide fade" tabindex="-1" role="dialog" id={%id%} data-hidetype="remove">'
          + '<div class="modal-dialog">'
            + '<div class="modal-content">'
              + '<div class="modal-header">'
                + (options.closeBtn ? '<button type="button" class="sui-close" data-dismiss="modal" aria-hidden="true">&times;</button>' : '')
                + '<h4 class="modal-title">{%title%}</h4>'
              + '</div>'
              + '<div class="modal-body ' + (options.hasfoot ? '' : 'no-foot') + '">{%body%}</div>'
              + (options.hasfoot ? '<div class="modal-footer">'
              //增加data-ok="modal"参数
                + '<button type="button" class="sui-btn btn-primary btn-large" data-ok="modal">{%ok_btn%}</button>'
                + (options.cancelBtn ? '<button type="button" class="sui-btn btn-default btn-large" data-dismiss="modal">{%cancel_btn%}</button>' : '')
              + '</div>' : '')
            + '</div>'
          + '</div>'
        + '</div>';
      element = $(TPL.replace('{%title%}', options.title)
                      .replace('{%body%}', options.body)
                      .replace('{%id%}', options.id)
                      .replace('{%ok_btn%}', options.okBtn)
                      .replace('{%cancel_btn%}', options.cancelBtn))
      //如果不支持动画显示（默认支持）
      $('body').append(element)
    }
    this.$element = $(element)
    if (!options.transition) $(element).removeClass('fade')
    this.init()

  }
  //对外接口只有toggle, show, hide
  Modal.prototype = {
    constructor: Modal
    ,init: function () {
      var ele = this.$element
        , opt = this.options
        , w = opt.width
        , h = opt.height
        , self = this
        , standardW = {
            small: 440  //默认宽度
            ,normal: 590
            ,large: 790
          }
      ele.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
        .delegate(':not(.disabled)[data-ok="modal"]', 'click.ok.modal', $.proxy(this.okHide, this))
      if (w) {
        standardW[w] && (w = standardW[w])
        ele.width(w).css('margin-left', -parseInt(w) / 2)
      }
      h && ele.find('.modal-body').height(h);
      if (typeof this.options.remote == 'string') {
        this.$element.find('.modal-body').load(this.options.remote)
      }
    }

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
    }

    , show: function () {
        var self = this
          , e = $.Event('show')
          , ele = this.$element
        ele.trigger(e)
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true
        this.escape()
        this.backdrop(function () {
          var transition = $.support.transition && ele.hasClass('fade')
          if (!ele.parent().length) {
            ele.appendTo(document.body) //don't move modals dom position
          }
          //处理dialog在页面中的定位
          self.resize()

          ele.show()
          if (transition) {
            ele[0].offsetWidth // force reflow
          }
          ele
            .addClass('in')
            .attr('aria-hidden', false)
          self.enforceFocus()
          transition ?
            ele.one($.support.transition.end, function () {
              callbackAfterTransition(self)
            }) :
            callbackAfterTransition(self)

          function callbackAfterTransition(self) {
            self.$element.focus().trigger('shown')
            if (self.options.timeout > 0) {
              self.timeid = setTimeout(function(){
                self.hide();
              }, self.options.timeout)
            }
          }
        })
        return ele
      }

    , hide: function (e) {
        e && e.preventDefault()
        var $ele = this.$element
        e = $.Event('hide')
        this.hideReason != 'ok' && $ele.trigger('cancelHide')
        $ele.trigger(e)
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false
        this.escape()
        $(document).off('focusin.modal')
        this.timeid && clearTimeout(this.timeid)
        $ele
          .removeClass('in')
          .attr('aria-hidden', true)
        $.support.transition && $ele.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
        return $ele
      }
    , okHide: function(e){
        var self = this
        // 如果e为undefined而不是事件对象，则说明不是点击确定按钮触发的执行，而是手工调用，
        // 那么直接执行hideWithOk
        if (!e) {
          hideWithOk()
          return
        }
        var fn = this.options.okHide
          , ifNeedHide = true
        if (!fn) {
            var eventArr = $._data(this.$element[0], 'events').okHide
            if (eventArr && eventArr.length) {
                fn = eventArr[eventArr.length - 1].handler;
            }
        }
        typeof fn == 'function' && (ifNeedHide = fn.call(this))
        //显式返回false，则不关闭对话框
        if (ifNeedHide !== false){
          hideWithOk()
        }
        function hideWithOk (){
          self.hideReason = 'ok'
          self.hide(e)
        }
        return self.$element
    }
    //对话框内部遮罩层
    , shadeIn: function () {
        var $ele = this.$element
        if ($ele.find('.shade').length) return
        var $shadeEle = $('<div class="shade in" style="background:' + this.options.bgcolor + '"></div>')
        $shadeEle.appendTo($ele)
        this.hasShaded = true
        return this.$element
    }
    , shadeOut: function () {
        this.$element.find('.shade').remove()
        this.hasShaded = false
        return this.$element
    }
    , shadeToggle: function () {
        return this[!this.hasShaded ? 'shadeIn' : 'shadeOut']()
    }
    // dialog展示后，如果高度动态发生变化，比如塞入异步数据后撑高容器，则调用$dialog.modal('resize'),使dialog重新定位居中
    , resize: function() {
      var ele = this.$element
        ,eleH = ele.height()
        ,winH = $(window).height()
        ,mt = 0
      if (eleH >= winH)
          mt = -winH/2
      else
          mt = (winH - eleH) / (1 + 1.618) - winH / 2
      ele.css('margin-top', parseInt(mt))
      return ele
    }
    , enforceFocus: function () {
        var self = this
        //防止多实例时循环触发
        $(document).off('focusin.modal') .on('focusin.modal', function (e) {
          if (self.$element[0] !== e.target && !self.$element.has(e.target).length) {
            self.$element.focus()
          }
        })
      }

    , escape: function () {
        var self = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && self.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var self = this
          , timeout = setTimeout(function () {
              self.$element.off($.support.transition.end)
              self.hideModal()
            }, 300)
        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          self.hideModal()
        })
      }

    , hideModal: function () {
        var self = this
          ,ele = this.$element
        ele.hide()
        this.backdrop(function () {
          self.removeBackdrop()
          ele.trigger(self.hideReason == 'ok' ? 'okHidden' : 'cancelHidden')
          self.hideReason = null
          ele.trigger('hidden')
          //销毁静态方法生成的dialog元素 , 默认只有静态方法是remove类型
          ele.data('hidetype') == 'remove' && ele.remove()
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var self = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''
          , opt = this.options
        if (this.isShown) {
          var doAnimate = $.support.transition && animate
          //如果显示背景遮罩层
          if (opt.backdrop !== false) {
            this.$backdrop = $('<div class="sui-modal-backdrop ' + animate + '" style="background:' + opt.bgcolor + '"/>')
            .appendTo(document.body)
            //遮罩层背景黑色半透明
            this.$backdrop.click(
              opt.backdrop == 'static' ?
                $.proxy(this.$element[0].focus, this.$element[0])
              : $.proxy(this.hide, this)
            )
            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
            this.$backdrop.addClass('in ')
            if (!callback) return
            doAnimate ?
              this.$backdrop.one($.support.transition.end, callback) :
              callback()
          } else {
            callback && callback()
          }
        } else {
          if (this.$backdrop) {
            this.$backdrop.removeClass('in')
            $.support.transition && this.$element.hasClass('fade')?
              this.$backdrop.one($.support.transition.end, callback) :
              callback()
          } else {
            callback && callback();
          }
        }
      }
  }

 /* MODAL PLUGIN DEFINITION
  * ======================= */


  var old = $.fn.modal

  $.fn.modal = function (option) {
    //this指向dialog元素Dom，
    //each让诸如 $('#qqq, #eee').modal(options) 的用法可行。
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      //这里判断的目的是：第一次show时实例化dialog，之后的show则用缓存在data-modal里的对象。
      if (!data) $this.data('modal', (data = new Modal(this, options)))

      //如果是$('#xx').modal('toggle'),务必保证传入的字符串是Modal类原型链里已存在的方法。否则会报错has no method。
      if (typeof option == 'string') data[option]()
      else data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , bgcolor: '#000'
    , keyboard: true
    , hasfoot: true
    , closeBtn: true
    , transition: true
  }

  $.fn.modal.Constructor = Modal
 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }

 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      //$target这里指dialog本体Dom(若存在)
      //通过data-target="#foo"或href="#foo"指向
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      //remote,href属性如果以#开头，表示等同于data-target属性
      , option = $target.data('modal') ? 'toggle' : $this.data()
    e.preventDefault()
    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
    })
  })

  /* jquery弹层静态方法，用于很少重复，不需记住状态的弹层，可方便的直接调用，最简单形式就是$.alert('我是alert')
   * 若弹层内容是复杂的Dom结构， 建议将弹层html结构写到模版里，用$(xx).modal(options) 调用
   *
   * example
   * $.alert({
   *  title: '自定义标题'
   *  body: 'html' //必填
   *  okBtn : '好的'
   *  cancelBtn : '雅达'
   *  closeBtn: true
   *  keyboard: true   是否可由esc按键关闭
   *  backdrop: true   决定是否为模态对话框添加一个背景遮罩层。另外，该属性指定'static'时，表示添加遮罩层，同时点击模态对话框的外部区域不会将其关闭。

   *  bgcolor : '#123456'  背景遮罩层颜色
   *  width: {number|string(px)|'small'|'normal'|'large'}推荐优先使用后三个描述性字符串，统一样式
   *  height: {number|string(px)} 高度
   *  timeout: {number} 1000    单位毫秒ms ,dialog打开后多久自动关闭
   *  transition: {Boolean} 是否以动画弹出对话框，默认为true。HTML使用方式只需把模板里的fade的class去掉即可
   *  hasfoot: {Boolean}  是否显示脚部  默认true
   *  remote: {string} 如果提供了远程url地址，就会加载远端内容
   *  show:     fn --------------function(e){}
   *  shown:    fn
   *  hide:     fn
   *  hidden:   fn
   *  okHide:   function(e){alert('点击确认后、dialog消失前的逻辑,
   *            函数返回true（默认）则dialog关闭，反之不关闭;若不传入则默认是直接返回true的函数
   *            注意不要人肉返回undefined！！')}
   *  okHidden: function(e){alert('点击确认后、dialog消失后的逻辑')}
   *  cancelHide: fn
   *  cancelHidden: fn
   * })
   *
   */
  $.extend({
    _modal: function(dialogCfg, customCfg){
      var modalId = +new Date()

        ,finalCfg = $.extend({}, $.fn.modal.defaults
          , dialogCfg
          , {id: modalId, okBtn: '确定'}
          , (typeof customCfg == 'string' ? {body: customCfg} : customCfg))
      var dialog = new Modal(null, finalCfg)
        , $ele = dialog.$element
      _bind(modalId, finalCfg)
      $ele.data('modal', dialog).modal('show')
      function _bind(id, eList){
        var eType = ['show', 'shown', 'hide', 'hidden', 'okHidden', 'cancelHide', 'cancelHidden']
        $.each(eType, function(k, v){
          if (typeof eList[v] == 'function'){
            $(document).on(v, '#'+id, $.proxy(eList[v], $('#' + id)[0]))
          }
        })
      }
      //静态方法对话框返回对话框元素的jQuery对象
      return $ele
    }
    //为最常见的alert，confirm建立$.modal的快捷方式，
    ,alert: function(customCfg){
      var dialogCfg = {
        type: 'alert'
        ,title: '注意'
      }
      return $._modal(dialogCfg, customCfg)
    }
    ,confirm: function(customCfg){
      var dialogCfg = {
        type: 'confirm'
        ,title: '提示'
        ,cancelBtn: '取消'
      }
      return $._modal(dialogCfg, customCfg)
    }
  })

}(window.jQuery);
