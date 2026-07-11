<?php

header('Content-Type: text/html; charset=utf-8');

$openapiUrl = 'openapi.json';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swagger UI - API Trung tâm Anh ngữ</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui.css" />
    <style>
        body { margin: 0; background: #f5f7fb; }
        #swagger-ui { min-height: 100vh; }
    </style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui-standalone-preset.min.js"></script>
<script>
  window.onload = function() {
    const ui = SwaggerUIBundle({
      url: openapiUrl + '?v=' + new Date().getTime(),
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: 'StandaloneLayout',
      docExpansion: 'list',
      defaultModelRendering: 'example',
      persistAuthorization: true,
      validatorUrl: null,
      oauth2RedirectUrl: window.location.origin + window.location.pathname,
      requestInterceptor: (request) => {
        if (!request.headers) request.headers = {};
        if (!request.headers.Authorization && window.localStorage.getItem('swaggerToken')) {
          request.headers.Authorization = 'Bearer ' + window.localStorage.getItem('swaggerToken');
        }
        return request;
      }
    });
    window.ui = ui;
  };
</script>
</body>
</html>
