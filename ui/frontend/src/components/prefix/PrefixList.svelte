<script lang="ts">
	export let availablePrefixes: string[] = [];
	export let currentPrefixName: string = "";
	export let newPrefixName: string = "";
	export let onSelectPrefix: (name: string) => void;
	export let onCreatePrefix: () => void;
	export let onRemovePrefix: (name: string) => void;
</script>

<div class="sidebar-section glass">
	<div class="section-header">
		<h2>Available Prefixes</h2>
	</div>
	<div class="prefix-list">
		{#each availablePrefixes as name}
			<div class="prefix-item-wrapper" class:active={currentPrefixName === name}>
				<button
					class="prefix-item-btn"
					on:click={() => onSelectPrefix(name)}
				>
					<span class="folder-icon">
						<span class="material-icons">folder</span>
					</span>
					<span class="name">{name}</span>
				</button>
				{#if name !== "Default"}
					<button 
						class="remove-btn" 
						title="Delete Prefix" 
						on:click|stopPropagation={() => onRemovePrefix(name)}
					>
						<span class="material-icons">delete</span>
					</button>
				{/if}
			</div>
		{/each}
		{#if availablePrefixes.length === 0}
			<div class="empty-state">
				No prefixes found in default directory.
			</div>
		{/if}
	</div>
	<div class="add-prefix-area">
		<input
			type="text"
			placeholder="New prefix..."
			bind:value={newPrefixName}
			class="input sm"
			on:keydown={(e) =>
				e.key === "Enter" && onCreatePrefix()}
		/>
		<button class="btn primary sm" on:click={onCreatePrefix}
			>Create</button
		>
	</div>
</div>

<style lang="scss">
	.sidebar-section {
		display: flex;
		flex-direction: column;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--glass-border);
		background: var(--glass-surface);
		height: 100%;
		box-sizing: border-box;

		.section-header {
			padding: 16px;
			border-bottom: 1px solid var(--glass-border);
			h2 {
				font-size: 0.9rem;
				margin: 0;
				color: var(--text-dim);
				text-transform: uppercase;
				letter-spacing: 1px;
			}
		}
	}

	.prefix-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.prefix-item-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 8px;
		transition: all 0.2s;
		padding-right: 8px;

		&:hover {
			background: var(--glass-hover);
			
			.remove-btn {
				opacity: 1;
			}
		}

		&.active {
			background: var(--accent-primary);
			color: var(--glass-bg);
			font-weight: 600;

			.folder-icon .material-icons {
				color: var(--glass-bg);
			}
			
			.remove-btn {
				color: var(--glass-bg);
				&:hover {
					background: rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	.prefix-item-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		flex: 1;
		font-weight: inherit;
		overflow: hidden;

		.folder-icon {
			font-size: 1.1rem;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 18px;
			height: 18px;

			.material-icons {
				font-size: 1.2rem;
				color: var(--accent-primary);
			}
		}

		.name {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.remove-btn {
		background: transparent;
		border: none;
		color: var(--text-dim);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		opacity: 0;
		transition: all 0.2s;

		&:hover {
			background: rgba(255, 0, 0, 0.1);
			color: var(--danger);
		}

		.material-icons {
			font-size: 1.1rem;
		}
	}


	.add-prefix-area {
		padding: 16px;
		border-top: 1px solid var(--glass-border);
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--glass-surface);
	}
	.empty-state {
		padding: 32px;
		text-align: center;
		color: var(--text-dim);
		font-size: 0.8rem;
	}
	.input.sm {
		padding: 8px 12px;
		font-size: 0.85rem;
	}
	.btn.sm {
		padding: 8px;
		font-size: 0.85rem;
	}
</style>
