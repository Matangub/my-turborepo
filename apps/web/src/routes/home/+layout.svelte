<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Header />
<div class="p-8">
	<slot />
</div>
