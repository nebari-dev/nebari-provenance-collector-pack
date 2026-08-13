import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signOut } from "@/auth/keycloak";
import { Topbar } from "@/components/Topbar";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { renderWithProviders as render } from "@/test/render";

// Keep the real Keycloak test shim (it supplies the signed-in user) but make
// signOut observable.
vi.mock("@/auth/keycloak", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/auth/keycloak")>();
  return { ...actual, signOut: vi.fn() };
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  vi.clearAllMocks();
});

describe("Topbar", () => {
  it("links the logo to the homepage with an accessible label", () => {
    render(<Topbar />);

    const homeLink = screen.getByRole("link", { name: /go to homepage/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("shows the signed-in user's name", () => {
    render(<Topbar />);

    // Name comes from the Keycloak test shim in src/test/setup.ts.
    expect(screen.getByRole("button", { name: /account menu/i })).toHaveTextContent("Test User");
  });

  it("selects a theme mode from the profile menu", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));

    await user.click(await screen.findByRole("menuitemradio", { name: /dark mode/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(screen.getByRole("menuitemradio", { name: /light mode/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(screen.getByRole("menuitemradio", { name: /system theme/i }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });

  it("reflects the current theme mode via aria-checked", async () => {
    const user = userEvent.setup();
    localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(<Topbar />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));

    expect(await screen.findByRole("menuitemradio", { name: /dark mode/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("menuitemradio", { name: /light mode/i })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("menuitemradio", { name: /system theme/i })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("calls signOut from the account menu", async () => {
    const user = userEvent.setup();

    render(<Topbar />);

    await user.click(screen.getByRole("button", { name: /account menu/i }));
    await user.click(await screen.findByRole("menuitem", { name: /sign out/i }));

    expect(signOut).toHaveBeenCalledOnce();
  });
});
