# Pages CMS Patch

Copy these files into the repo root, replacing existing files:

- admin/index.html
- netlify/functions/content.js
- api/bootstrap.php
- api/content.php

Then commit/push and redeploy Netlify. For Zemi, upload these same changed files to public_html.

Fixes:
- Adds Route ID / URL path field to Pages admin.
- Saves both route and slug automatically.
- Uses route as primary identifier, slug as fallback.
- Adds formatted page body preview/render support in admin.
- Keeps Netlify + Zemi backend compatibility.
