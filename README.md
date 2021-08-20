# Setup Development Environment with Nginx and PHP-FPM

Create custom image by adding XSLT to php:8-fpm

```
#
# don't forget the DOT at the end
docker build --tag php8-fpm_with_xslt --file ./Dockerfile.php8-fpm_with_xslt .
```
