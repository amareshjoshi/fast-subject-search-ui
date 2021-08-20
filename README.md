# Setup Development Environment with Nginx and PHP-FPM

## Add XSLT libs to the PHP-FPM image 

```
# don't forget the DOT at the end
docker build --tag php8-fpm_with_xslt --file ./Dockerfile.php8-fpm_with_xslt .
```

## Examine and edit the configuration files

## Source files are in `html`

## To start: `docker-compose up --detach`

## To stop: `docker-compose down`

