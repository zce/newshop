$(function(){
    $("#collect").click(function(){
        if ($(this).children('i').hasClass('icon-tb-like')){
            $(this).children('i').removeClass('icon-tb-like').addClass('icon-tb-likefill')
        } else {
            $(this).children('i').removeClass('icon-tb-likefill').addClass('icon-tb-like')
        }
    })
    $("#comment").click(function(){
        if ($(this).children('i').hasClass('icon-tb-wang')){
            $(this).children('i').removeClass('icon-tb-wang').addClass('icon-tb-wangfill')
        } else {
            $(this).children('i').removeClass('icon-tb-wangfill').addClass('icon-tb-wang')
        }
    })
})