<script lang="ts">
	export let sysInfo: {
		os: string;
		kernel: string;
		cpu: string;
		gpu: string;
		ram: string;
		driver: string;
	};
	export let sysUsage: {
		cpu: string;
		ram: string;
		gpu: string;
	};
</script>

<div class="status-grid">
	<!-- OS -->
	<div class="status-box">
		<div class="box-header">
			<div class="icon-label">
				<span class="material-icons mini-icon">laptop_windows</span>
				<span class="label">SYSTEM</span>
			</div>
		</div>
		<div class="system-info">
			<span class="os-text" title={sysInfo.os}>{sysInfo.os}</span>
			<span class="kernel-text">Kernel: {sysInfo.kernel}</span>
		</div>
	</div>

	<!-- CPU -->
	<div class="status-box">
		<div class="box-header">
			<div class="icon-label">
				<span class="material-icons mini-icon">memory</span>
				<span class="label">CPU</span>
			</div>
			<span class="usage">{sysUsage.cpu}</span>
		</div>
		<div class="progress-bg">
			<div class="progress-fill" style="width: {sysUsage.cpu}"></div>
		</div>
		<span class="info-text" title={sysInfo.cpu}>{sysInfo.cpu}</span>
	</div>

	<!-- RAM -->
	<div class="status-box">
		<div class="box-header">
			<div class="icon-label">
				<span class="material-icons mini-icon">storage</span>
				<span class="label">RAM</span>
			</div>
			<span class="usage">
				{sysUsage.ram.includes("(")
					? sysUsage.ram.split("(").pop().replace(")", "")
					: "0%"}
			</span>
		</div>
		<div class="progress-bg">
			<div
				class="progress-fill"
				style="width: {sysUsage.ram.includes('(')
					? sysUsage.ram.split('(').pop().replace(')', '')
					: '0%'}"
			></div>
		</div>
		<span class="info-text">{sysUsage.ram.split(" / ")[0]} used</span>
	</div>

	<!-- GPU -->
	<div class="status-box">
		<div class="box-header">
			<div class="icon-label">
				<span class="material-icons mini-icon">videogame_asset</span>
				<span class="label">GPU</span>
			</div>
			<span class="usage">{sysUsage.gpu}</span>
		</div>
		<div class="progress-bg">
			<div
				class="progress-fill"
				style="width: {sysUsage.gpu}; background: var(--accent-secondary, #b197fc)"
			></div>
		</div>
		<span class="info-text" title="{sysInfo.gpu} ({sysInfo.driver})">
			{sysInfo.gpu}
		</span>
	</div>
</div>

<style lang="scss">
	.status-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	.status-box {
		background: var(--glass-surface);
		padding: 12px;
		border-radius: 12px;
		border: 1px solid var(--glass-border);
		display: flex;
		flex-direction: column;
		min-width: 0;

		.box-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 8px;

			.icon-label {
				display: flex;
				align-items: center;
				gap: 6px;
				color: var(--text-dim);

				.mini-icon {
					font-size: 14px;
					opacity: 0.8;
				}

				.label {
					font-size: 0.7rem;
					font-weight: 900;
				}
			}

			.usage {
				font-size: 0.9rem;
				font-weight: 700;
				color: var(--accent-primary);
			}
		}

		.info-text {
			display: block;
			font-size: 0.7rem;
			color: var(--text-muted);
			margin-top: 8px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.system-info {
			display: flex;
			flex-direction: column;
			gap: 2px;
			overflow: hidden;

			.os-text {
				font-size: 0.8rem;
				font-weight: 700;
				color: var(--text-main);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.kernel-text {
				font-size: 0.65rem;
				color: var(--text-muted);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.progress-bg {
		height: 4px;
		background: var(--glass-hover);
		border-radius: 2px;
		overflow: hidden;

		.progress-fill {
			height: 100%;
			background: var(--accent-primary);
			transition: width 0.3s ease;
		}
	}
</style>
