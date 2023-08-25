<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, DarkMode } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-red-700 md:bg-transparent md:text-red-700 md:dark:text-white dark:bg-red-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
</script>

<Navbar let:hidden let:toggle class="border-b-[1px] border-gray-200">
	<NavBrand href="/">
		<img
			src="https://flowbite-svelte.com/images/flowbite-svelte-icon-logo.svg"
			class="mr-3 h-6 sm:h-9"
			alt="Flowbite Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span
		>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl
		{activeUrl}
		{hidden}
		{activeClass}
		{nonActiveClass}
		ulClass="flex flex-row gap-8 items-center"
	>
		<NavLi href="/home">Home</NavLi>
		<NavLi href="/docs/components/navbar">Docs</NavLi>
		<DarkMode />
		<form method="post">
			<Button formaction="?/logout" type="submit">Logout</Button>
		</form>
	</NavUl>
</Navbar>
