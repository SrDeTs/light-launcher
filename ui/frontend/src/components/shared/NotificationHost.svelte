<script lang="ts">
	import { notifications } from "@stores/notificationStore";
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";
</script>

<div class="notification-container">
	{#each $notifications as n (n.id)}
		<div
			class="notification-card {n.type} glass"
			animate:flip={{ duration: 300 }}
			in:fly={{ x: 100, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<span class="material-icons mini-icon">
				{#if n.type === "error"}
					error_outline
				{:else if n.type === "success"}
					check_circle_outline
				{:else}
					info_outline
				{/if}
			</span>
			<div class="message">{n.message}</div>
			<button class="close" on:click={() => notifications.remove(n.id)}>
				<span class="material-icons">close</span>
			</button>
		</div>
	{/each}
</div>

<style lang="scss">
	.notification-container {
		position: fixed;
		top: 32px;
		right: 32px;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 350px;
		max-width: 90%;
		pointer-events: none;
	}

	.notification-card {
		pointer-events: auto;
		padding: 16px 20px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
		border: 1px solid var(--glass-border);
		background: var(--glass-surface);
		backdrop-filter: blur(12px);
		color: var(--text-main);

		.mini-icon {
			font-size: 1.25rem;
			flex-shrink: 0;
		}

		&.error {
			border-left: 4px solid #ef4444;
			.mini-icon { color: #ef4444; }
		}
		&.success {
			border-left: 4px solid #10b981;
			.mini-icon { color: #10b981; }
		}
		&.info {
			border-left: 4px solid #818cf8;
			.mini-icon { color: #818cf8; }
		}

		.message {
			flex: 1;
			font-size: 0.85rem;
			font-weight: 600;
			line-height: 1.4;
		}

		.close {
			background: none;
			border: none;
			color: var(--text-dim);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			padding: 4px;
			opacity: 0.6;
			transition: opacity 0.2s;

			.material-icons {
				font-size: 18px;
			}

			&:hover {
				opacity: 1;
				color: var(--text-main);
			}
		}
	}
</style>
