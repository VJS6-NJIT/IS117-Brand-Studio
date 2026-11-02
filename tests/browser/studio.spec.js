import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("negative: choosing no size explains the problem and keeps the bag empty", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#size-error")).toBeVisible();
  await expect(page.locator("#size-error")).not.toBeEmpty();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("positive: a shopper can choose sizes, add items, and empty the demo bag", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('input[name="size"][value="M"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("1");
  await expect(page.locator("#bag-status")).toContainText("M");
  await page.locator('input[name="size"][value="L"]').check();
  await page
    .getByRole("button", { name: "Add to demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("2");
  await page
    .getByRole("button", { name: "Empty demo bag", exact: true })
    .click();
  await expect(page.locator("#bag-count")).toHaveText("0");
  await page.reload();
  await expect(page.locator("#bag-count")).toHaveText("0");
});

test("keyboard: the skip link reaches main and the size controls work without a mouse", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  // Focus a native radio, then use its real keyboard behavior and the next control.
  await page.locator('input[name="size"][value="S"]').focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name="size"][value="M"]')).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Add to demo bag", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#bag-count")).toHaveText("1");
});

test("storefront shows the approved COMMON THREAD offer and fit CTA target", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Different lives. One common thread.",
    }),
  ).toBeVisible();
  await expect(page.locator(".brand-hero-support")).toHaveText(
    "Made to fit into your everyday life and personal style.",
  );
  await expect(
    page.getByRole("heading", { name: "The Everyday White Tee" }),
  ).toBeVisible();
  await expect(page.locator(".price")).toContainText("$28");
  await expect(page.locator(".price-row .micro-label")).toHaveText(
    "Fictional demo price",
  );
  await expect(page.locator('input[name="size"]')).toHaveCount(4);
  const fitLink = page.getByRole("link", { name: "Find your fit." });
  await expect(fitLink).toHaveAttribute("href", "#size-selector");
  await fitLink.click();
  await expect(page).toHaveURL(/#size-selector$/);
  await expect(page.locator("#size-selector")).toBeInViewport();
});

test("COMMON THREAD logo assets render at navigation and style-guide sizes", async ({
  page,
}) => {
  await page.goto("/");
  const navigationLogo = page.locator(".storefront-logo");
  await expect(navigationLogo).toBeVisible();
  expect(
    await navigationLogo.evaluate((image) => ({
      width: image.getBoundingClientRect().width,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    })),
  ).toEqual({ width: 176, naturalWidth: 640, naturalHeight: 112 });
  await expect(
    page.getByRole("link", { name: "COMMON THREAD storefront home" }),
  ).toBeVisible();

  await page.goto("/styleguide.html");
  const logoImages = page.locator("#logo img");
  await expect(logoImages).toHaveCount(4);
  const rendered = await logoImages.evaluateAll((images) =>
    images.map((image) => ({
      source: new URL(image.src).pathname.split("/").at(-1),
      loaded: image.complete && image.naturalWidth === 640,
      width: image.getBoundingClientRect().width,
    })),
  );
  expect(rendered.map(({ source }) => source)).toEqual([
    "wordmark.svg",
    "wordmark.svg",
    "wordmark-monochrome.svg",
    "wordmark-reversed.svg",
  ]);
  expect(rendered.every(({ loaded }) => loaded)).toBeTruthy();
  expect(rendered[0].width).toBeGreaterThan(300);
  expect(rendered[1].width).toBe(176);
  await expect(page.locator(".logo-variant-dark")).toHaveCSS(
    "background-color",
    "rgb(48, 51, 46)",
  );
  const monochrome = await page.request.get("/assets/wordmark-monochrome.svg");
  const reversed = await page.request.get("/assets/wordmark-reversed.svg");
  expect(await monochrome.text()).toContain('stroke="#30332E"');
  expect(await reversed.text()).toContain('stroke="#EAE9E1"');
});

test("live style guide reflects approved COMMON THREAD decisions and behavior", async ({
  page,
}) => {
  await page.goto("/styleguide.html");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A versatile essential. A place to belong.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      /neutral examples|neutral starter|not a completed brand strategy|to decide/i,
    ),
  ).toHaveCount(0);
  await expect(page.locator("#direction")).toContainText(
    "Primary / Everyman: Everyone belongs.",
  );
  await expect(page.locator("#direction")).toContainText(
    "Secondary / Creator: Express who you are.",
  );
  await expect(page.locator("#direction")).toContainText(
    "It better communicates comfort, simplicity, and belonging.",
  );
  await expect(page.locator("#direction")).toContainText(
    "Create approachable everyday clothing that brings people together through comfort, versatility, and shared identity.",
  );
  await expect(page.locator("#direction")).toContainText(
    "Build a welcoming lifestyle brand where people from different backgrounds can feel connected without sacrificing individuality.",
  );
  await expect(page.locator("#voice")).toContainText(
    "Different lives. One common thread.",
  );
  await expect(page.locator("#voice")).toContainText(
    "Made for every day. Welcome to everyone.",
  );
  await expect(page.locator("#voice")).toContainText(
    "Find your fit. Make it your own.",
  );
  await expect(page.locator("#voice")).toContainText(
    "The essentials that bring us together.",
  );
  await expect(page.locator("#palette code")).toHaveText([
    "#EAE9E1",
    "#30332E",
    "#A5A18F",
    "#B7A28B",
    "#66745E",
  ]);
  expect(
    await page
      .locator("body")
      .evaluate((element) =>
        getComputedStyle(element).fontFamily.includes("DM Sans"),
      ),
  ).toBeTruthy();
  expect(
    await page
      .locator(".type-accent")
      .evaluate((element) =>
        getComputedStyle(element).fontFamily.includes("Lora"),
      ),
  ).toBeTruthy();
  await expect(page.locator("[data-css-value]")).toHaveText([
    "82px",
    "3.5rem 4rem",
    "2.5rem",
  ]);
  const fitLink = page.getByRole("link", { name: "Find your fit." });
  await fitLink.hover();
  await expect(fitLink).toHaveCSS("background-color", "rgb(165, 161, 143)");
  await fitLink.click();
  await expect(page).toHaveURL(/index\.html#size-selector$/);
  await expect(page.locator("#size-selector")).toBeInViewport();
});

test("storefront keyboard navigation shows focus and reaches the size selector", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /skip/i })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".brand-link")).toBeFocused();
  expect(
    await page
      .locator(".brand-link")
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");

  for (let tab = 0; tab < 5; tab += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(page.locator(".brand-cta")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#size-selector$/);
  await expect(page.locator("#size-selector")).toBeInViewport();
});

for (const route of [
  "/",
  "/styleguide.html",
  "/studio.html",
  "/explorations/modernist.html",
  "/explorations/postmodernist.html",
]) {
  test(`page integrity and automated accessibility: ${route}`, async ({
    page,
  }) => {
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    page.on("response", (response) => {
      if (
        response.url().startsWith("http://127.0.0.1:5174") &&
        response.status() >= 400
      ) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(brokenImages).toEqual([]);
    const links = await page
      .locator("a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href")),
      );
    for (const href of links) {
      if (href.startsWith("#")) {
        expect(
          await page.locator(`[id="${href.slice(1)}"]`).count(),
          href,
        ).toBeGreaterThan(0);
      } else if (!/^(https?:|mailto:)/.test(href)) {
        const response = await page.request.get(new URL(href, page.url()).href);
        expect(response.ok(), href).toBeTruthy();
      }
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`narrow screen: readable page without horizontal overflow ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.getByRole("main")).toBeVisible();
    if (route.startsWith("/explorations/")) {
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "Different lives. One common thread.",
        }),
      ).toBeVisible();
      await expect(page.locator(".lifestyle-photo")).toBeVisible();
      await expect(
        page.locator('input[name="size"][value="XL"]'),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Find your fit." }),
      ).toBeVisible();
    }
  });
}

test("the two previews use identical approved content and image assets", async ({
  page,
}) => {
  const directions = [];
  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  for (const route of [
    "/explorations/modernist.html",
    "/explorations/postmodernist.html",
  ]) {
    await page.goto(route);
    directions.push({
      headline: await page.getByRole("heading", { level: 1 }).innerText(),
      supporting: await page.locator(".hero-support").innerText(),
      callToAction: normalize(await page.locator(".hero-cta").innerText()),
      product: await page.locator("#product-name").innerText(),
      price: normalize(await page.locator(".price-row").innerText()),
      lifestyleImage: await page
        .locator(".lifestyle-photo")
        .getAttribute("src"),
      shirtImage: await page.locator(".shirt-image").getAttribute("src"),
      sizes: await page
        .locator('input[name="size"]')
        .evaluateAll((inputs) => inputs.map((input) => input.value)),
    });
  }
  expect(directions[0]).toEqual(directions[1]);
  expect(directions[0]).toMatchObject({
    headline: "Different lives. One common thread.",
    supporting: "Made to fit into your everyday life and personal style.",
    callToAction: "Find your fit. ↓",
    product: "The Everyday White Tee",
    price: "$28 USD Fictional demo price",
    sizes: ["S", "M", "L", "XL"],
  });
});

test("postmodernist keyboard focus contrasts against the Sand surfaces", async ({
  page,
}) => {
  await page.goto("/explorations/postmodernist.html");
  const wordmark = page.getByRole("link", { name: "COMMON THREAD" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(wordmark).toBeFocused();
  expect(
    await wordmark.evaluate(
      (element) => getComputedStyle(element).outlineColor,
    ),
  ).toBe("rgb(48, 51, 46)");
  expect(
    await page
      .locator(".site-header")
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe("rgb(183, 162, 139)");

  const sizeInput = page.locator('input[name="size"][value="S"]');
  await sizeInput.focus();
  expect(
    await page
      .locator(".size-option")
      .first()
      .evaluate((element) => getComputedStyle(element).outlineColor),
  ).toBe("rgb(48, 51, 46)");
});

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "narrow mobile", width: 375, height: 812 },
]) {
  test(`Postmodernist fit CTA supports keyboard and click navigation at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/explorations/postmodernist.html");

    const fitCta = page.getByRole("link", { name: "Find your fit." });
    await expect(fitCta).toBeVisible();
    let reachedCta = false;
    for (let tab = 0; tab < 12; tab += 1) {
      await page.keyboard.press("Tab");
      if (
        await fitCta.evaluate((element) => element === document.activeElement)
      ) {
        reachedCta = true;
        break;
      }
    }
    expect(reachedCta).toBe(true);
    await expect(fitCta).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#product-form$/);
    await expect(page.locator("#product-form")).toBeInViewport();
    await expect(
      page.getByRole("group", { name: "Choose a size" }),
    ).toBeVisible();
    await expect(page.locator('input[name="size"]').first()).toBeInViewport();

    await page.goto("/explorations/postmodernist.html");
    await page.getByRole("link", { name: "Find your fit." }).click();
    await expect(page).toHaveURL(/#product-form$/);
    await expect(page.locator("#product-form")).toBeInViewport();
    await expect(
      page.getByRole("group", { name: "Choose a size" }),
    ).toBeVisible();
    await expect(page.locator('input[name="size"]').first()).toBeInViewport();
  });
}

for (const route of [
  "/explorations/modernist.html",
  "/explorations/postmodernist.html",
]) {
  test(`preview negative: missing size keeps the bag empty ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.getByRole("button", { name: "Add to demo bag" }).click();
    await expect(page.locator("#size-error")).toBeVisible();
    await expect(page.locator("#bag-count")).toHaveText("0");
  });

  test(`preview positive: add by size, empty, and reset ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator('input[name="size"][value="M"]').check();
    await page.getByRole("button", { name: "Add to demo bag" }).click();
    await expect(page.locator("#bag-count")).toHaveText("1");
    await expect(page.locator("#bag-status")).toContainText("M");
    await expect(page.locator("#bag-items")).toContainText("Size M");
    await page.locator('input[name="size"][value="L"]').check();
    await page.getByRole("button", { name: "Add to demo bag" }).click();
    await expect(page.locator("#bag-count")).toHaveText("2");
    await expect(page.locator("#bag-items")).toContainText("Size L");
    await page.getByRole("button", { name: "Empty demo bag" }).click();
    await expect(page.locator("#bag-count")).toHaveText("0");
    await page.reload();
    await expect(page.locator("#bag-count")).toHaveText("0");
  });

  test(`preview keyboard: CTA and size controls work without a mouse ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await page.locator(".hero-cta").focus();
    await expect(page.locator(".hero-cta")).toBeFocused();
    await page.keyboard.press("Enter");
    await page.locator('input[name="size"][value="S"]').focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('input[name="size"][value="M"]')).toBeChecked();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Add to demo bag" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#bag-count")).toHaveText("1");
  });
}
