<script lang="ts">
	import { onMount } from "svelte";
	import {
		PickFile,
		PickFolder,
		ScanProtonVersions,
		RunGame,
		GetConfig,
		ListPrefixes,
		GetPrefixBaseDir,
		GetSystemToolsStatus,
		LoadPrefixConfig,
		GetInitialLauncherPath,
		DetectLosslessDll,
		GetExeIcon,
	} from "@bindings/light-launcher/ui/backend/app";
	import * as core from "@bindings/light-launcher/internal/core/models";
	import ConfigForm from "@components/shared/ConfigForm.svelte";
	import SlideButton from "@components/shared/SlideButton.svelte";
	import ExecutableSelector from "@components/run/ExecutableSelector.svelte";
	import PrefixSelector from "@components/run/PrefixSelector.svelte";
	import ProtonSelector from "@components/run/ProtonSelector.svelte";
	import LaunchButton from "@components/run/LaunchButton.svelte";
	import MissingDependenciesModal from "@components/run/MissingDependenciesModal.svelte";
	import { notifications } from "@stores/notificationStore";
	import { runState } from "@stores/runState";
	import { get } from "svelte/store";
	import { Window } from "@wailsio/runtime";
	import { createLaunchOptions } from "@lib/formService";

	// Component State
	let mounted = false;

	// Game Selection
	let mainExePath = "";
	let gameIcon = "";
	let launcherIcon = "";
	let prefixPath = "";
	let baseDir = "";
	let selectedPrefixName = "Default";

	// Prefix & Utilities
	let availablePrefixes: string[] = [];

	// Proton
	let protonVersions: core.ProtonTool[] = [];
	let protonOptions: string[] = [];
	let selectedProton = "";
	let isLoadingProton = true;

	// Game exe toggle state - keep in sync with options
	let haveGameExe = false;

	$: if (options) haveGameExe = options.HaveGameExe;
	$: if (options) options.HaveGameExe = haveGameExe;

	// UI State
	let showLogsWindow = false;
	let showValidationModal = false;
	let missingToolsList: string[] = [];
	let systemStatus: core.SystemToolsStatus = {
		hasGamescope: false,
		hasMangoHud: false,
		hasGameMode: false,
	};

	// Config
	let options: core.LaunchOptions = createLaunchOptions();

	import { loadConfigForGame, loadConfigForPrefix } from "@lib/runConfig";

	function handleConfigUpdate(newOpts: core.LaunchOptions, pPath: string, pName: string, proton: string) {
		options = newOpts;
		if (pPath) prefixPath = pPath;
		if (pName) selectedPrefixName = pName;
		if (proton && selectedProton === "") selectedProton = proton;
	}

	async function doLoadConfigForGame(path: string) {
		await loadConfigForGame(path, options, prefixPath, baseDir, selectedPrefixName, protonVersions, handleConfigUpdate);
	}

	async function doLoadConfigForPrefix(name: string) {
		await loadConfigForPrefix(name, options, prefixPath, baseDir, protonVersions, handleConfigUpdate);
	}

	onMount(async () => {
		try {
			baseDir = await GetPrefixBaseDir();
			const s = get(runState);
			if (s) {
				if (s.mainExePath) {
					mainExePath = s.mainExePath;
					options.MainExecutablePath = s.mainExePath;
				}
				if (s.gameIcon) gameIcon = s.gameIcon;
				if (s.launcherIcon) launcherIcon = s.launcherIcon;
				if (s.prefixPath) prefixPath = s.prefixPath;
				if (s.selectedPrefixName)
					selectedPrefixName = s.selectedPrefixName;
				if (s.selectedProton) selectedProton = s.selectedProton;
				if (s.options) {
					options = { ...options, ...s.options };
				}
			}

			if (options.LauncherPath) {
				await doLoadConfigForGame(options.LauncherPath);
				if (!launcherIcon) {
					const icon = await GetExeIcon(options.LauncherPath);
					if (icon) launcherIcon = icon;
				}
			}

			const initialPath = await GetInitialLauncherPath();
			if (initialPath) {
				// Only set as game/launcher if not already set, or if explicitly passed from tray
				if (!options.LauncherPath && !options.MainExecutablePath) {
					// No prior state - set initial path as launcher
					options.LauncherPath = initialPath;
					const icon = await GetExeIcon(initialPath);
					if (icon) launcherIcon = icon;
				} else if (
					!options.MainExecutablePath ||
					options.MainExecutablePath === options.LauncherPath
				) {
					// Prior state has launcher but no game - set initial path as game
					mainExePath = initialPath;
					options.MainExecutablePath = initialPath;
					const icon = await GetExeIcon(initialPath);
					if (icon) gameIcon = icon;
					await doLoadConfigForGame(initialPath);
				}
			}

			// Load icons for any paths that don't have icons yet
			if (options.LauncherPath && !launcherIcon) {
				const icon = await GetExeIcon(options.LauncherPath);
				if (icon) launcherIcon = icon;
			}
			if (options.MainExecutablePath && !gameIcon) {
				const icon = await GetExeIcon(options.MainExecutablePath);
				if (icon) gameIcon = icon;
			}

			const [tools, prefixes, base, sysStatus] = await Promise.all([
				ScanProtonVersions(),
				ListPrefixes(),
				GetPrefixBaseDir(),
				GetSystemToolsStatus(),
			]);
			if (tools) {
				protonVersions = tools;
				protonOptions = tools.map((t) => t.DisplayName);
				if (protonOptions.length > 0 && !selectedProton) {
					selectedProton = protonOptions[0];
				}
			}
			availablePrefixes = Array.isArray(prefixes)
				? prefixes
				: ["Default"];
			baseDir = base;
			systemStatus = sysStatus;

			if (!prefixPath) {
				prefixPath = baseDir + "/Default";
				selectedPrefixName = "Default";
				await doLoadConfigForPrefix("Default");
			}
		} catch (err) {
			console.error("Failed to initialize:", err);
		} finally {
			isLoadingProton = false;
			mounted = true;
		}
	});

	$: if (mounted) {
		runState.set({
			mainExePath,
			gameIcon,
			launcherIcon,
			prefixPath,
			selectedPrefixName,
			selectedProton,
			options,
		});
	}

	async function handlePrefixChange(name: string) {
		if (name !== "Custom...") {
			prefixPath = baseDir + "/" + name;
			selectedPrefixName = name;
			await doLoadConfigForPrefix(name);
		}
	}

	async function handleBrowseGame() {
		try {
			const path = await PickFile();
			if (path) {
				console.log("[GAME] Selected game exe:", path);
				console.log(
					"[GAME] Current LauncherPath before game selection:",
					options.LauncherPath,
				);
				mainExePath = path;
				// Use object spread to trigger Svelte reactivity
				options = { ...options, MainExecutablePath: path };
				console.log(
					"[GAME] Set options.MainExecutablePath to:",
					options.MainExecutablePath,
				);
				console.log(
					"[GAME] LauncherPath after game selection:",
					options.LauncherPath,
				);
				console.log(
					"[GAME] Full options object:",
					JSON.stringify(options),
				);
				// NOTE: Do NOT load config for game exe
				// Game exe is only for LSFG profile matching
				// Configuration is ALWAYS saved under launcher exe path only
			}
		} catch (err) {
			console.error("[GAME] Error loading game:", err);
		}
	}

	async function handleBrowseLauncher() {
		try {
			const path = await PickFile();
			if (path) {
				console.log("[LAUNCHER] Selected launcher exe:", path);
				options = { ...options, LauncherPath: path };
				console.log(
					"[LAUNCHER] Set options.LauncherPath to:",
					options.LauncherPath,
				);
				console.log(
					"[LAUNCHER] Full options object after assignment:",
					JSON.stringify(options),
				);

				// Only set MainExecutablePath if user has not explicitly selected a separate game exe
				if (!mainExePath) {
					console.log(
						"[LAUNCHER] No separate game exe selected by user, initializing MainExecutablePath to launcher",
					);
					options = { ...options, MainExecutablePath: path };
					console.log(
						"[LAUNCHER] Set MainExecutablePath to launcher path:",
						options.MainExecutablePath,
					);
				} else {
					console.log(
						"[LAUNCHER] User already selected separate game exe, keeping MainExecutablePath:",
						mainExePath,
					);
				}

				// Load config for the launcher
				// applyConfigToOptions will enforce UseGameExe if true
				console.log(
					"[LAUNCHER] Loading config for launcher path...",
				);
				await doLoadConfigForGame(path);
				console.log(
					"[LAUNCHER] Config loaded, final MainExecutablePath:",
					options.MainExecutablePath,
				);
			}
		} catch (err) {
			console.error("[LAUNCHER] Error selecting launcher:", err);
		}
	}

	async function handleBrowsePrefix() {
		try {
			const path = await PickFolder();
			if (path) {
				prefixPath = path;
				selectedPrefixName = path.split('/').filter(Boolean).pop() || "Custom";
			}
		} catch (err) {
			console.error(err);
		}
	}

	function handleProtonChange(value: string) {
		selectedProton = value;
	}

	async function handleLaunch() {
		if (!options.LauncherPath) {
			notifications.add(
				"Please select a launcher executable.",
				"error",
			);
			return;
		}

		if (options.EnableLsfgVk && !options.LsfgDllPath) {
			notifications.add("LSFG-VK requires Lossless.dll.", "error");
			return;
		}

		missingToolsList = [];
		if (options.EnableGamescope && !systemStatus.hasGamescope)
			missingToolsList.push("Gamescope");
		if (options.EnableMangoHud && !systemStatus.hasMangoHud)
			missingToolsList.push("MangoHud");
		if (options.EnableGamemode && !systemStatus.hasGameMode)
			missingToolsList.push("GameMode");
		if (missingToolsList.length > 0) {
			showValidationModal = true;
			return;
		}
		await proceedToLaunch();
	}

	async function proceedToLaunch() {
		showValidationModal = false;
		console.log("\n============ PROCEED TO LAUNCH ============");

		// DEBUG: Log state at execution time
		console.log("[EXECUTE] Step 1 - Initial state");
		console.log(
			"[EXECUTE]   options.LauncherPath:",
			options.LauncherPath,
		);
		console.log(
			"[EXECUTE]   options.MainExecutablePath:",
			options.MainExecutablePath,
		);
		console.log("[EXECUTE]   mainExePath variable:", mainExePath);
		console.log("[EXECUTE]   Full options:", JSON.stringify(options));

		const tool = protonVersions.find(
			(p) => p.DisplayName === selectedProton,
		);
		let cleanName = selectedProton;
		if (cleanName.startsWith("(Steam) ")) {
			cleanName = cleanName.substring(8);
		}

		// Config is ALWAYS saved to launcher path via SaveGameConfig backend logic
		// MainExecutablePath remains the actual executable to run
		// LauncherPath is provided to SaveGameConfig for config storage
		options.PrefixPath = prefixPath;
		options.ProtonPattern = cleanName;
		options.ProtonPath = tool ? tool.Path : "";

		console.log(
			"[EXECUTE] Step 2 - Final options object before RunGame:",
		);
		console.log(JSON.stringify(options, null, 2));
		console.log("============ ABOUT TO CALL RunGame ============\n");

		try {
			console.log(
				"[EXECUTE] Calling RunGame with LauncherPath:",
				options.LauncherPath,
			);
			console.log(
				"[EXECUTE] Calling RunGame with MainExecutablePath:",
				options.MainExecutablePath,
			);
			console.log(
				"[EXECUTE] Calling RunGame with full options:",
				JSON.stringify(options, null, 2),
			);
			await RunGame(options, showLogsWindow);
			Window.Close();
		} catch (err) {
			console.error("[EXECUTE] Launch failed:", err);
			notifications.add(`Launch failed: ${err}`, "error");
		}
	}
</script>

<div class="run-container">
	<div class="header-row">
		<h1 class="page-title">Launch Configuration</h1>
	</div>

	<!-- Executable Selector Component -->
	<ExecutableSelector
		launcherPath={options.LauncherPath}
		mainExePath={options.MainExecutablePath}
		bind:haveGameExe
		bind:launcherIcon
		bind:gameIcon
		onBrowseLauncher={handleBrowseLauncher}
		onBrowseGame={handleBrowseGame}
	/>

	<!-- Main Form Container -->
	<div class="form-container">
		<PrefixSelector
			bind:availablePrefixes
			bind:selectedPrefixName
			bind:prefixPath
			{baseDir}
			onPrefixChange={handlePrefixChange}
			onBrowsePrefix={handleBrowsePrefix}
		/>

		<ProtonSelector
			bind:protonOptions
			bind:selectedProton
			bind:isLoadingProton
			onProtonChange={handleProtonChange}
		/>

		<ConfigForm bind:options />

		<div class="form-group">
			<SlideButton
				bind:checked={showLogsWindow}
				label="Show Logs"
				subtitle="Open logs in terminal"
			/>
		</div>

		<MissingDependenciesModal
			show={showValidationModal}
			missingTools={missingToolsList}
			onClose={() => (showValidationModal = false)}
			onConfirm={proceedToLaunch}
		/>

		<LaunchButton onLaunch={handleLaunch} />
	</div>
</div>

<style lang="scss">
	.run-container {
		display: flex;
		flex-direction: column;
		padding: 32px;
	}
	.form-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}




	.page-title {
		font-size: 2rem;
		font-weight: bold;
		color: var(--text-main);
		margin: 0 0 24px 0;
	}
</style>
