<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PAGE_SIZE } from '$lib/consts.js';
	import { Badge, Button, Card, Checkbox, Dropdown, Modal, Pagination } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { insertBadgeSchema, insertJobSchema } from '../../lib/schema.js';
	import { Icon } from 'flowbite-svelte-icons';
	import { Jumper, Pulse, SyncLoader } from 'svelte-loading-spinners';

	export let data;

	let insertModalOpen = false;
	let badges: typeof $form.badges = [];

	const badgeEnum = insertBadgeSchema.shape.label.Values;
	const badgesMap = new Map([
		[badgeEnum['AWS'], 'yellow'],
		[badgeEnum['GCE'], 'blue'],
		[badgeEnum['Azure'], 'green'],
		[badgeEnum['Kubernetes'], 'red'],
		[badgeEnum['Docker'], 'indigo'],
		[badgeEnum['Terraform'], 'purple'],
		[badgeEnum['Jenkins'], 'pink'],
		[badgeEnum['Gitlab'], 'yellow'],
		[badgeEnum['Github'], 'blue'],
		[badgeEnum['Git'], 'green'],
		[badgeEnum['Python'], 'red'],
		[badgeEnum['HTML'], 'red'],
		[badgeEnum['CSS'], 'indigo'],
		[badgeEnum['Java'], 'indigo'],
		[badgeEnum['Javascript'], 'purple'],
		[badgeEnum['Typescript'], 'pink'],
		[badgeEnum['Angular'], 'yellow'],
		[badgeEnum['React'], 'blue'],
		[badgeEnum['Vue'], 'green'],
		[badgeEnum['Svelte'], 'red'],
		[badgeEnum['NodeJS'], 'indigo'],
		[badgeEnum['Golang'], 'purple'],
		[badgeEnum['Rust'], 'pink']
	] as const);

	$: pageIndex = +($page.url.searchParams.get('page') ?? '1');

	$: numberOfPages = Math.ceil(data.totalJobsCount / PAGE_SIZE);
	$: pages = [...Array(numberOfPages)].map((_, counter) => ({
		name: `${counter + 1}`,
		active: pageIndex === counter + 1,
		href: `?page=${counter + 1}`
	}));

	const { form, errors, allErrors, constraints, enhance, delayed } = superForm(data.insertForm, {
		clearOnSubmit: 'none',
		invalidateAll: true,
		dataType: 'json',
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid) {
				insertModalOpen = false;
				badges = [];
			}
		},
		multipleSubmits: 'prevent'
	});

	const { enhance: deleteEnhance, delayed: deleteDelay } = superForm(data.deleteForm, {
		multipleSubmits: 'prevent'
	});

	const previous = () => {
		goto(`?page=${Math.max(pageIndex - 1, 1)}`);
	};
	const next = () => {
		goto(`?page=${Math.min(pageIndex + 1, numberOfPages)}`);
	};

	$: $form.badges = badges;
</script>

<div class="flex flex-row justify-between items-center py-4">
	<Pagination {pages} on:previous={previous} on:next={next} />

	<Button on:click={() => (insertModalOpen = true)}>Post a job</Button>
</div>

<Modal title="Add a job post" bind:open={insertModalOpen} autoclose transition={slide}>
	<!-- Modal body -->
	<form
		id="myForm"
		action="?/addJob"
		method="post"
		class="grid gap-4 mb-4 sm:grid-cols-2"
		use:enhance
	>
		<div>
			<label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Title</label
			>
			<input
				bind:value={$form.title}
				{...$constraints.title}
				type="text"
				name="title"
				title="title"
				id="title"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="Type job title"
				required
			/>
			{#if $errors.title}<span class="text-red-500">{$errors.title}</span>{/if}
		</div>
		<div>
			<label for="company" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Company</label
			>
			<input
				bind:value={$form.company}
				{...$constraints.company}
				type="text"
				name="company"
				id="company"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="company"
				required
			/>
			{#if $errors.company}<span class="text-red-500">{$errors.company}</span>{/if}
		</div>
		<div>
			<label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Role</label
			>
			<select
				id="role"
				name="role"
				bind:value={$form.role}
				{...$constraints.role}
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			>
				{#each insertJobSchema.shape.role._def.values as role}
					<option>{role}</option>
				{/each}
			</select>
			{#if $errors.role}<span class="text-red-500">{$errors.role}</span>{/if}
		</div>
		<div class="sm:col-span-2">
			<label for="linkedin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>linkedin job link</label
			>
			<input
				bind:value={$form.linkedin}
				{...$constraints.linkedin}
				type="url"
				name="link"
				id="link"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="link"
				required
			/>
			{#if $errors.linkedin}<span class="text-red-500">{$errors.linkedin}</span>{/if}
		</div>
		<div class="sm:col-span-2">
			<label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>description</label
			>
			<textarea
				id="description"
				name="description"
				bind:value={$form.description}
				{...$constraints.description}
				rows="4"
				class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="Write job description here"
			/>
			{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
		</div>

		<div class="flex flex-col">
			<Button type="button" class="w-fit" on:click={(event) => event.stopPropagation()}
				>Badges ({badges.length})</Button
			>
			<Dropdown class="p-3 gap-4 text-sm grid grid-cols-2">
				{#each [...badgesMap] as [colorKey, colorValue]}
					<li>
						<Checkbox bind:group={badges} value={colorKey}>
							<Badge rounded color={colorValue} class="m-0">{colorKey}</Badge>
						</Checkbox>
					</li>
				{/each}
			</Dropdown>
			{#if $errors.badges}<span class="text-red-500">{$errors.badges._errors}</span>{/if}
		</div>
	</form>
	{#if $allErrors.length && $allErrors.find((error) => error.path === '_errors')}
		<ul>
			{#each $allErrors as error}
				<li class="text-red-500">
					{error.messages.join('. ')}
				</li>
			{/each}
		</ul>
	{/if}
	<svelte:fragment slot="footer">
		<Button type="submit" on:click={(e) => e.stopPropagation()} form="myForm"
			>Add new job listing
			{#if $delayed}<span>...</span>{/if}
		</Button>
		<Button color="alternative">Cancel</Button>
	</svelte:fragment>
</Modal>

{#if !data.data.length}
	<section class="bg-transparent">
		<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
			<div class="mx-auto max-w-screen text-center">
				<h1
					class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500"
				>
					No jobs found
				</h1>
				<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
					Add a job post to get started
				</p>
			</div>
		</div>
	</section>
{:else}
	<div class="cardsWrapper">
		{#each data.data as job}
			<Card>
				<h5
					class="mb-2 flex justify-between items-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
				>
					{job.title}
					<form action="?/deleteJob" method="post" use:deleteEnhance>
						<input type="hidden" name="id" value={job.id} />
						{#if job.user_id === data.session?.user.userId}
							<Button type="submit" color="alternative">
								{#if $deleteDelay}
									<Pulse size="30" unit="px" duration="1s" />
								{:else}
									<Icon name="trash-bin-solid" size="sm" class="outline-none" />
								{/if}
							</Button>
						{/if}
					</form>
				</h5>
				<div class="flex flex-row items-center gap-2 mb-4">
					{#each job.badges as badge}
						<Badge rounded color={badgesMap.get(badge.label)}>{badge.label}</Badge>
					{/each}
				</div>
				<div class="grid grid-cols-2 grid-rows-2 gap-1 mb-4">
					<span class="dark:text-white text-gray-900">company:</span>
					<h6>{job.company}</h6>
					<span class="dark:text-white text-gray-900">role:</span>
					<h6>{job.role}</h6>
					<span class="dark:text-white text-gray-900">linkedin:</span>
					<a target="_blank" rel="noopener noreferrer" href={job.linkedin}
						><Icon name="linkedin-solid" size="sm" class="outline-none text-blue-500" /></a
					>
				</div>
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
					{job.description}
				</p>
			</Card>
		{/each}
	</div>
{/if}

<style>
	.cardsWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1rem;
	}
</style>
