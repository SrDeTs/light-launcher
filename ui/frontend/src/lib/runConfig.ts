import * as core from "@bindings/light-launcher/internal/core/models";
import { GetConfig, LoadPrefixConfig, DetectLosslessDll } from "@bindings/light-launcher/ui/backend/app";

export async function loadConfigForGame(
	path: string,
	options: core.LaunchOptions,
	prefixPath: string,
	baseDir: string,
	selectedPrefixName: string,
	protonVersions: core.ProtonTool[],
	updateOptions: (newOpts: core.LaunchOptions, pPath: string, pName: string, proton: string) => void
) {
	try {
		const config = await GetConfig(path);
		if (config) {
			const newPrefixPath = config.PrefixPath;
			let newPrefixName = selectedPrefixName;
			if (newPrefixPath.startsWith(baseDir)) {
				newPrefixName = newPrefixPath.replace(baseDir + "/", "");
			} else {
				newPrefixName = newPrefixPath.split('/').filter(Boolean).pop() || "Custom";
			}
			const updatedProton = applyConfigToOptions(config, options, protonVersions);
			updateOptions(options, newPrefixPath, newPrefixName, updatedProton);
		} else {
			await loadConfigForPrefix(selectedPrefixName, options, prefixPath, baseDir, protonVersions, updateOptions);
		}

		// Auto-detect Lossless.dll if not already set
		if (!options.LsfgDllPath) {
			try {
				const dll = await DetectLosslessDll();
				if (dll) {
					options.LsfgDllPath = dll;
					updateOptions(options, prefixPath, selectedPrefixName, ""); // triggers reactivity
				}
			} catch (err) {
				console.error("Failed to detect Lossless.dll:", err);
			}
		}
	} catch (err) {}
}

export async function loadConfigForPrefix(
	name: string,
	options: core.LaunchOptions,
	prefixPath: string,
	baseDir: string,
	protonVersions: core.ProtonTool[],
	updateOptions: (newOpts: core.LaunchOptions, pPath: string, pName: string, proton: string) => void
) {
	if (name === "Custom..." || !prefixPath.startsWith(baseDir)) return;
	try {
		const config = await LoadPrefixConfig(name);
		if (config) {
			const savedMainExePath = options.MainExecutablePath;
			const savedLauncherPath = options.LauncherPath;
			const savedHaveGameExe = options.HaveGameExe;
			const savedPrefixPath = options.PrefixPath;

			const updatedProton = applyConfigToOptions(config, options, protonVersions);

			// Restore Target
			options.MainExecutablePath = savedMainExePath;
			options.LauncherPath = savedLauncherPath;
			options.HaveGameExe = savedHaveGameExe;

			let newPrefixPath = prefixPath;
			if (savedPrefixPath) {
				options.PrefixPath = savedPrefixPath;
				newPrefixPath = savedPrefixPath;
			}
			updateOptions(options, newPrefixPath, name, updatedProton);
		}
	} catch (err) {}
}

export function applyConfigToOptions(
	config: core.LaunchOptions,
	options: core.LaunchOptions,
	protonVersions: core.ProtonTool[]
): string {
	let selectedProton = "";
	const match = protonVersions.find((p) => p.Path === config.ProtonPath);
	if (match) {
		selectedProton = match.DisplayName;
	} else if (config.ProtonPattern) {
		selectedProton = config.ProtonPattern;
	}

	options.CustomArgs = config.CustomArgs || "";
	options.EnableMangoHud = config.EnableMangoHud;
	options.EnableGamemode = config.EnableGamemode;
	options.EnableLsfgVk = config.EnableLsfgVk;
	options.LsfgMultiplier = config.LsfgMultiplier || "2";
	options.LsfgPerfMode = config.LsfgPerfMode;
	options.LsfgDllPath = config.LsfgDllPath || "";
	options.LsfgGpu = config.LsfgGpu || "";
	options.LsfgFlowScale = config.LsfgFlowScale || "0.8";
	options.LsfgPacing = config.LsfgPacing || "none";
	options.LsfgAllowFp16 = config.LsfgAllowFp16 || false;
	
	if (!options.LauncherPath && config.LauncherPath) {
		options.LauncherPath = config.LauncherPath;
	}
	options.HaveGameExe = config.HaveGameExe === true; 

	if (!options.HaveGameExe && options.LauncherPath) {
		options.MainExecutablePath = options.LauncherPath;
	} else if (options.HaveGameExe && config.MainExecutablePath) {
		options.MainExecutablePath = config.MainExecutablePath;
	}

	options.EnableGamescope = config.EnableGamescope;
	options.GamescopeW = config.GamescopeW || "1920";
	options.GamescopeH = config.GamescopeH || "1080";
	options.GamescopeR = config.GamescopeR || "60";
	options.EnableMemoryMin = config.EnableMemoryMin;
	options.MemoryMinValue = config.MemoryMinValue || "4G";

	return selectedProton;
}
