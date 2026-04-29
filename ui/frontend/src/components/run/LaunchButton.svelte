<script lang="ts">
	export let onLaunch: () => void;
</script>

<div class="action-area">
	<button class="btn primary launch-btn" on:click={onLaunch}>
		<span class="material-icons run-icon">rocket_launch</span>
		<span>LAUNCH GAME</span>
	</button>
</div>

<style lang="scss">
	.action-area {
		position: sticky;
		bottom: -32px; /* Locks to the bottom edge of the view */
		margin: 48px -32px -32px -32px; /* Pull out of parent padding */
		padding: 32px;
		z-index: 10;
		background: linear-gradient(to top, var(--glass-bg) 70%, transparent);
		display: flex;
		justify-content: center;
		pointer-events: none; /* Let clicks pass through the gradient area */
	}

	.launch-btn {
		pointer-events: auto; /* Re-enable clicks for the button */
		width: 100%;
		max-width: 600px;
		height: 60px;
		padding: 0 32px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: var(--accent-primary) !important;
		color: var(--glass-bg) !important;
		border: none;
		box-shadow: var(--glass-shadow);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		font-weight: 800;
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;

		span {
			display: block;
		}

		&:hover {
			background: var(--accent-secondary) !important;
			transform: translateY(-4px) scale(1.02);
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

			.run-icon {
				transform: rotate(-10deg) scale(1.1);
			}
		}

		&:active {
			transform: translateY(-2px) scale(0.98);
		}

		.run-icon {
			font-size: 28px;
			transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
		}
	}
</style>
