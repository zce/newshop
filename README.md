# newshop-frontend

## TODOS

- [ ] 基础功能
- [ ] 收货地址操作
- [ ] AJAX (PJAX) 体验增强

## Deploy

```shell
$ sudo ln -s /var/www/ns.uieee.com/ns.uieee.com.conf /etc/nginx/sites-available/ns.uieee.com.conf
$ sudo ln -s /etc/nginx/sites-available/ns.uieee.com.conf /etc/nginx/sites-enabled/ns.uieee.com.conf
$ sudo rm -rf /etc/nginx/sites-enabled/default
$ sudo rm -rf /etc/nginx/sites-available/default
$ sudo systemctl reload nginx
```
