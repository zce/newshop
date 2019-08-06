/**
 * 分页页码 helper
 */

const url = require('url')
const { SafeString } = require('express-hbs')

module.exports = (current, total, opts) => {
  // 没有更多的页面 分个毛呀
  if (total < 2) return

  const urlObj = url.parse(opts.data.req.originalUrl, true)

  // 获取当前访问链接
  // 1. 通过获取此次访问的页面链接
  // 2. 解析这个链接，替换掉分页参数，其他保持不变
  function getPageUrl (page) {
    urlObj.query.page = page
    delete urlObj.search // !!!
    return url.format(urlObj)
  }

  // 根据传过来的参数生成分页页码 HTML
  const visibles = opts.hash.visibles || 5
  const region = Math.floor(visibles / 2)

  let begin = current - region
  begin = begin < 1 ? 1 : begin

  let end = begin + visibles - 1
  end = end > total ? total : end

  // end 重新赋值过后可能导致 begin 不对称
  begin = end - visibles + 1
  begin = begin < 1 ? 1 : begin

  let result = '<div class="sui-pagination pagination-large"><ul>'

  if (current > 1) {
    result += `<li class="prev"><a href="${getPageUrl(current - 1)}">« 上一页</a></li>`
  }

  if (begin > 1) {
    result += `<li class="dotted"><span>...</span></li>`
  }

  for (let i = begin; i <= end; i++) {
    // 当前页高亮
    if (i === current) {
      result += `<li class="active"><span>${i}</span></li>`
    } else {
      result += `<li><a href="${getPageUrl(i)}">${i}</a></li>`
    }
  }

  if (end < total) {
    result += `<li class="dotted"><span>...</span></li>`
  }

  if (current < total) {
    result += `<li class="next"><a href="${getPageUrl(current + 1)}">下一页»</a></li>`
  }

  result += `</ul>
  <span>共${total}页</span>
  <div><form>到第 <input type="text" name="page" class="page-num"> 页 <button class="page-confirm">确定</button></form></div>
</div>`

  // SafeString 可以让 {{}} 正常输出 HTML
  return new SafeString(result)
}
