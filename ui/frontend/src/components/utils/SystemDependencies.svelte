<script lang="ts">
	export let systemStatus: {
		hasGamescope: boolean;
		hasMangoHud: boolean;
		hasGameMode: boolean;
		hasLosslessDll: boolean;
	};
</script>

<div class="section-container glass">
	<h3>System Dependencies</h3>
	<div class="system-status-grid">
		<div class="status-item" class:ok={systemStatus.hasGamescope}>
			<span class="dot"></span>
			<span class="label">Gamescope</span>
			<span class="value">
				{systemStatus.hasGamescope ? "Available" : "Not Found"}
			</span>
		</div>
		<div class="status-item" class:ok={systemStatus.hasMangoHud}>
			<span class="dot"></span>
			<span class="label">MangoHud</span>
			<span class="value">
				{systemStatus.hasMangoHud ? "Available" : "Not Found"}
			</span>
		</div>
		<div class="status-item" class:ok={systemStatus.hasGameMode}>
			<span class="dot"></span>
			<span class="label">GameMode</span>
			<span class="value">
				{systemStatus.hasGameMode ? "Available" : "Not Found"}
			</span>
		</div>
		<div class="status-item" class:ok={systemStatus.hasLosslessDll}>
			<span class="dot"></span>
			<span class="label">Lossless.dll</span>
			<span class="value">
				{systemStatus.hasLosslessDll ? "Found" : "Not Found"}
			</span>
		</div>
	</div>
	{#if !systemStatus.hasGamescope || !systemStatus.hasMangoHud || !systemStatus.hasGameMode || !systemStatus.hasLosslessDll}
		<p class="warning-text">
			Some features may not work until you install these tools.
			LSFG-VK requires Lossless Scaling installed via Steam.
		</p>
	{/if}
</div>

<style lang="scss">
	.section-container {
		padding: 20px 24px;
		border-radius: 16px;
		border: 1px solid var(--glass-border);
		background: var(--glass-surface);
		margin-bottom: 32px;

		h3 {
			margin: 0 0 16px 0;
			font-size: 1rem;
			color: var(--text-dim);
			text-transform: uppercase;
			letter-spacing: 1px;
		}
	}

	.system-status-grid {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.9rem;
		padding: 8px 16px;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: 10px;
		color: var(--text-muted);

		.dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: #ef4444;
			box-shadow: 0 0 8px #ef4444;
		}
		.label {
			font-weight: 600;
			color: var(--text-main);
		}
		.value {
			font-size: 0.8rem;
			opacity: 0.8;
		}

		&.ok {
			.dot {
				background: #10b981;
				box-shadow: 0 0 8px #10b981;
			}
		}
	}

	.warning-text {
		font-size: 0.8rem;
		color: var(--accent-secondary);
		margin: 12px 0 0 0;
		font-style: italic;
	}
</style>
