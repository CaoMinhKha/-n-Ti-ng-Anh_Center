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
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui-standalone-preset.min.js"></script>
<script>
  window.onload = function() {
    const ui = SwaggerUIBundle({
      url: '<?php echo $openapiUrl; ?>',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: 'StandaloneLayout',
      docExpansion: 'none',
      defaultModelRendering: 'model'
    });
    window.ui = ui;
  };
</script>
</body>
</html>
