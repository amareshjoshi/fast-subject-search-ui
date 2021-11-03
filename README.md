# UI for Subject Search Using FAST Linked Data API

## Setup Development Environment with Nginx and PHP-FPM

- Steps

  - Add XSLT libs to the PHP-FPM image

```
# don't forget the DOT at the end
docker build --tag php8-fpm_with_xslt --file ./Dockerfile.php8-fpm_with_xslt .
```

- Examine and edit the configuration files
- Source files are in `html`
- To start: `docker-compose up --build --detach`
- To stop: `docker-compose down`
