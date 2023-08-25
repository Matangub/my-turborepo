<script lang="ts">
  import '../app.postcss';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';

  // Inject the Analytics functionality
  inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
  <title>Username &amp; password auth with Lucia</title>
</svelte:head>
<slot />
