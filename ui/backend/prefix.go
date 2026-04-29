package backend

import (
	"light-launcher/internal/core"
)

func (a *App) ListPrefixes() ([]string, error) {
	return core.ListPrefixes()
}

func (a *App) CreatePrefix(name string) error {
	return core.CreatePrefix(name)
}

func (a *App) GetPrefixBaseDir() string {
	return core.GetPrefixBaseDir()
}

func (a *App) RemovePrefix(name string) error {
	return core.RemovePrefix(name)
}
