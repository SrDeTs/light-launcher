<script lang="ts">
	import Dropdown from "@components/shared/Dropdown.svelte";
	
	export let availablePrefixes: string[] = [];
	export let selectedPrefixName: string = "Default";
	export let prefixPath: string = "";
	export let baseDir: string = "";
	export let onPrefixChange: (name: string) => Promise<void>;
	export let onBrowsePrefix: () => Promise<void>;
</script>

<div class="form-group">
	<label for="winePrefix">WINEPREFIX</label>
	<div class="input-group">
		<div class="dropdown-wrapper">
			<Dropdown
				options={[...availablePrefixes, "Custom..."]}
				bind:value={selectedPrefixName}
				onChange={onPrefixChange}
			/>
		</div>
		<button on:click={onBrowsePrefix} class="btn">Browse</button>
	</div>
	{#if selectedPrefixName === "Custom..." || !prefixPath.startsWith(baseDir)}
		<div class="path-display">{prefixPath}</div>
	{/if}
</div>

<style lang="scss">
	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 8px;
	}
	.input-group {
		display: flex;
		gap: 12px;
		width: 100%;
		.dropdown-wrapper {
			flex: 1;
		}
	}
	.path-display {
		margin-top: 8px;
		font-size: 0.75rem;
		color: var(--text-dim);
		word-break: break-all;
		padding: 8px;
		background: var(--glass-surface);
		border: 1px solid var(--glass-border);
		border-radius: 6px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 20px;
		border-radius: 10px;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--glass-border);
		background: var(--glass-hover);
		color: var(--text-main);
		&:hover {
			background: var(--glass-border);
			border-color: var(--glass-border-bright);
		}
	}
</style>
