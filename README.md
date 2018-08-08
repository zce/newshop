# newshop-frontend

## Arch

![newshop-arch](https://user-images.githubusercontent.com/6166576/43821572-215546ce-9b1c-11e8-8705-14cf0c7269df.png)

## TODOS

- [x] 基础功能
- [ ] 订单收货地址操作
- [ ] AJAX (PJAX) 体验增强

## Deploy

```shell
$ sudo ln -s /var/www/ns.uieee.com/ns.uieee.com.conf /etc/nginx/sites-available/ns.uieee.com.conf
$ sudo ln -s /etc/nginx/sites-available/ns.uieee.com.conf /etc/nginx/sites-enabled/ns.uieee.com.conf
$ sudo rm -rf /etc/nginx/sites-enabled/default
$ sudo rm -rf /etc/nginx/sites-available/default
$ sudo systemctl reload nginx
```
