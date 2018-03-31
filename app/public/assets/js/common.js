$(function ($) {
  // var cartCellTemplate = $('#tbar-cart-item-template').html()

  // 分类菜单
  $('.all-sorts-list').hover(function () {
    $(this).children('.sort').show()
  }, function () {
    $(this).children('.sort').hide()
  })

  $('.all-sort-list2 > .item').hover(function () {
    // 父类分类列表容器的高度
    $(this).addClass('hover')
  }, function () {
    $(this).removeClass('hover')
  })

  // 侧边悬浮按钮
  $('.toolbar-tab')
    .hover(function () {
      $(this).find('.tab-text').html($(this).data('title'))
      $(this).find('.tab-text').addClass('tbar-tab-hover')
      $(this).find('.footer-tab-text').addClass('tbar-tab-footer-hover')
      $(this).addClass('tbar-tab-selected')
    }, function () {
      $(this).find('.tab-text').removeClass('tbar-tab-hover')
      $(this).find('.footer-tab-text').removeClass('tbar-tab-footer-hover')
      $(this).removeClass('tbar-tab-selected')
    })
    .click(function () {
      var target = $(this).data('target')

      // 悬浮按钮
      $('.toolbar-tab').removeClass('tbar-tab-click-selected')
      $('.tbar-tab-' + target).addClass('tbar-tab-click-selected')

      // 面板内容
      $('.toolbar-panel').css('visibility', 'hidden')
      $('.tbar-panel-' + target).css({ 'visibility': 'visible', 'z-index': '1' })

      // 面板显示
      $('.toolbar-wrap').addClass('toolbar-open')
    })

  // 侧边栏关闭
  $('.close-panel').click(function () {
    $('.toolbar-tab').removeClass('tbar-tab-click-selected')
    $('.toolbar-wrap').removeClass('toolbar-open')
  })
})
