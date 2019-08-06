# newshop-backend

<!-- compare link: https://github.com/top-think/think/compare/6eda63b3d642c1bfdf6761091f7c631e8e7eecc6...5.1 -->

## TODOS

- [ ] cart * order endpoint?
- [ ] updated field update

## Docs

- https://documenter.getpostman.com/view/130308/newshop/RVncfwwX

## Deploy

```shell
$ sudo ln -s /var/www/newshop/service/ns-api.uieee.com.conf /etc/nginx/sites-available/ns-api.uieee.com.conf
$ sudo ln -s /etc/nginx/sites-available/ns-api.uieee.com.conf /etc/nginx/sites-enabled/ns-api.uieee.com.conf
$ sudo rm -rf /etc/nginx/sites-enabled/default
$ sudo rm -rf /etc/nginx/sites-available/default
$ sudo systemctl reload nginx
```
