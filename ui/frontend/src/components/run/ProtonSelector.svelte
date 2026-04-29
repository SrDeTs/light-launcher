<script lang="ts">
	import Dropdown from "@components/shared/Dropdown.svelte";
	
	export let protonOptions: string[] = [];
	export let selectedProton: string = "";
	export let isLoadingProton: boolean = true;
	export let onProtonChange: (value: string) => void;
</script>

<div class="form-group">
	<label for="protonVersion">Proton Version</label>
	<div id="protonVersion">
		<Dropdown
			options={protonOptions}
			bind:value={selectedProton}
			placeholder={isLoadingProton ? "Scanning..." : "Select Version"}
			disabled={isLoadingProton}
			onChange={onProtonChange}
		/>
	</div>
</div>

<style lang="scss">
	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 8px;
	}
</style>
