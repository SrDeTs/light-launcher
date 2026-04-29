<script lang="ts">
	export let status: { isLsfgInstalled: boolean; lsfgVersion: string };
	export let isInstalling: boolean;
	export let isUninstalling: boolean;
	export let progressMessage: string;
	export let progressPercent: number;
	export let handleInstall: () => Promise<void>;
	export let handleUninstall: () => Promise<void>;
	export let lsfgPng: string;
</script>

<div class="util-card glass">
	<div class="util-header">
		<div class="icon-bg">
			<img src={lsfgPng} alt="lsfg" class="lsfg-logo" />
		</div>
		<div class="title-area">
			<h3>LSFG-VK</h3>
			<span class="badge" class:installed={status.isLsfgInstalled}>
				{status.isLsfgInstalled ? "Installed" : "Not Installed"}
			</span>
		</div>
	</div>

	<div class="description">
		<p>
			Lossless Scaling is a Windows-exclusive program featuring various algorithms for scaling and interpolating programs.
		</p>
		<p>
			<strong>lsfg-vk</strong> is a Vulkan layer that hooks into Vulkan applications and generates additional frames using Lossless Scaling's frame generation algorithm.
		</p>
		<p class="note">
			Note: Requires Lossless Scaling downloaded on Steam.
		</p>
	</div>

	<div class="action-area">
		{#if status.isLsfgInstalled}
			<button
				class="btn danger"
				on:click={handleUninstall}
				disabled={isUninstalling}
			>
				{isUninstalling ? "Removing..." : "Remove Utility"}
			</button>
		{:else}
			<div class="install-controls">
				<button
					class="btn primary"
					on:click={handleInstall}
					disabled={isInstalling}
				>
					{isInstalling ? "Installing..." : "Install LSFG-VK"}
				</button>
				{#if isInstalling}
					<div class="install-progress-area">
						<div class="progress-header">
							<span class="msg">{progressMessage}</span>
							<span class="pct">{progressPercent}%</span>
						</div>
						<div class="progress-bar-container">
							<div
								class="progress-fill"
								style="width: {progressPercent}%"
							></div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.util-card {
		padding: 24px;
		border-radius: 20px;
		border: 1px solid var(--glass-border);
		background: var(--glass-surface);
		display: flex;
		flex-direction: column;
		gap: 20px;
		transition: all 0.2s;

		&:hover {
			background: var(--glass-border-bright);
			border-color: var(--glass-border-bright);
		}
	}

	.util-header {
		display: flex;
		align-items: center;
		gap: 20px;

		.icon-bg {
			width: 56px;
			height: 56px;
			background: var(--glass-bg);
			border: 1px solid var(--glass-border);
			border-radius: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.75rem;

			.lsfg-logo {
				width: 32px;
				height: 32px;
				color: var(--accent-primary);
				opacity: 0.9;
				object-fit: contain;
				filter: saturate(0) brightness(2);
			}
		}

		.title-area {
			display: flex;
			flex-direction: column;
			gap: 4px;

			h3 {
				margin: 0;
				font-size: 1.25rem;
				font-weight: 700;
			}
		}
	}

	.badge {
		display: inline-block;
		padding: 2px 10px;
		border-radius: 20px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		background: var(--glass-high-alpha);
		color: var(--text-muted);

		&.installed {
			background: rgba(16, 185, 129, 0.2);
			color: #10b981;
		}
	}

	.description {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.5;
		margin: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;

		p {
			margin: 0;
		}
		strong {
			color: var(--text-main);
		}
		.note {
			font-size: 0.8rem;
			color: var(--accent-secondary);
			font-style: italic;
			padding-top: 8px;
			border-top: 1px solid var(--glass-border);
		}
	}

	.install-controls {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.install-progress-area {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px;
		background: var(--glass-bg);
		border-radius: 12px;
		border: 1px solid var(--glass-border);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		font-weight: 600;

		.msg {
			color: var(--text-muted);
		}
		.pct {
			color: var(--accent-primary);
		}
	}

	.progress-bar-container {
		height: 8px;
		background: var(--glass-low-alpha);
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--glass-border);
	}

	.progress-fill {
		height: 100%;
		background: var(--accent-primary);
		transition: width 0.3s ease;
		box-shadow: 0 0 10px var(--glass-border-bright);
	}

	.action-area {
		margin-top: 8px;

		button {
			width: 100%;
			padding: 12px;
			font-weight: 600;
			letter-spacing: 0.5px;
		}
	}
</style>
