# WebTools

A minimal collection of single-page browser tools. No build step, no backend, no dependencies beyond CDN scripts.

**Stack:** HTML · [Tailwind CSS](https://tailwindcss.com) · [Alpine.js](https://alpinejs.dev)

## Usage

Open `index.html` in any browser.

## Adding a tool

1. Create `pages/your_tool.html` using this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tool — WebTools</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
</head>
<body class="bg-white min-h-screen flex flex-col items-center justify-center p-6">
  <nav class="w-full max-w-lg text-xs text-gray-400 mb-4">
    <a href="../index.html" class="text-gray-600 hover:text-gray-900">WebTools</a>
    <span class="mx-1">/</span>
    <span class="text-gray-900">My Tool</span>
  </nav>

  <div class="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-lg" x-data="{ ... }">
    <h1 class="text-base font-semibold text-gray-900 mb-6">My Tool</h1>
    <!-- tool content -->
  </div>
</body>
</html>
```

2. Add a card to `index.html`:

```html
<a href="pages/your_tool.html" class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-colors">
  <div class="text-sm font-medium text-gray-900">My Tool</div>
  <div class="text-xs text-gray-400 mt-1">One-line description</div>
</a>
```
