package config

import (
	"os"
	"path/filepath"
)

func GetBaseDirectory() string {
	homeDirectory, err := os.UserHomeDir()
	if err != nil {
		return "LightLauncher"
	}
	return filepath.Join(homeDirectory, "LightLauncher")
}

func GetConfigDirectory() string {
	return filepath.Join(GetBaseDirectory(), "config", "executables")
}

func GetPrefixBaseDirectory() string {
	return filepath.Join(GetBaseDirectory(), "prefixes")
}

func GetExecutableConfigPath(name string, id string) string {
	if id == "" {
		return filepath.Join(GetConfigDirectory(), name)
	}

	return filepath.Join(GetConfigDirectory(), id)
}

func GetGameConfigFilePath(name string, id string) string {
	return filepath.Join(GetExecutableConfigPath(name, id), "config.json")
}

func GetGameLsfgConfigPath(name string, id string) string {
	return filepath.Join(GetExecutableConfigPath(name, id), "lsfg_vk.toml")
}

func GetPrefixConfigPath(prefixName string) string {
	return filepath.Join(GetPrefixBaseDirectory(), prefixName, "light-launcher.json")
}
