import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { useThemePreference } from "./use-theme-preference";

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("useThemePreference", () => {
  it("defaults to system mode", () => {
    const { result } = renderHook(() => useThemePreference({ storageKey: THEME_STORAGE_KEY }));
    expect(result.current.themeMode).toBe("system");
  });

  it("toggles the dark class when set to dark", () => {
    const { result } = renderHook(() => useThemePreference({ storageKey: THEME_STORAGE_KEY }));

    act(() => result.current.setThemeMode("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => result.current.setThemeMode("light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the selected mode under the app's existing storage key", () => {
    const { result } = renderHook(() => useThemePreference({ storageKey: THEME_STORAGE_KEY }));
    act(() => result.current.setThemeMode("dark"));
    expect(localStorage.getItem("provenance:themeMode")).toBe("dark");
  });

  it("restores a previously persisted mode", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const { result } = renderHook(() => useThemePreference({ storageKey: THEME_STORAGE_KEY }));
    expect(result.current.themeMode).toBe("dark");
    expect(result.current.isDarkMode).toBe(true);
  });
});
