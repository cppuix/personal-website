(async function () {
  function isEnglishPreferred(site) {
    var htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.indexOf("en") === 0) {
      return true;
    }
    return site && site.default_language === "en";
  }

  function textByLang(arText, enText, useEnglish) {
    if (useEnglish && enText) {
      return enText;
    }
    return arText || enText || "";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && typeof value === "string") {
      el.textContent = value;
    }
  }

  function normalizeHref(url) {
    if (!url) {
      return "/";
    }
    return url;
  }

  async function loadJson(path) {
    var res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to load " + path);
    }
    return res.json();
  }

  try {
    var site = await loadJson("/content/site.json");
    var home = await loadJson("/content/home.json");
    var useEnglish = isEnglishPreferred(site);

    setText("home-hero-title", textByLang(home.hero.title_ar, home.hero.title_en, useEnglish));
    setText("home-hero-body", textByLang(home.hero.body_ar, home.hero.body_en, useEnglish));
    setText(
      "home-hero-source-label",
      textByLang(home.hero.source_label_ar, home.hero.source_label_en, useEnglish)
    );

    var sourceLink = document.getElementById("home-hero-source-link");
    if (sourceLink) {
      sourceLink.href = normalizeHref(home.hero.source_url);
    }

    setText("home-featured-heading", textByLang("المقترحات", "Featured", useEnglish));

    var grid = document.getElementById("home-featured-grid");
    if (grid && Array.isArray(home.featured_cards)) {
      grid.innerHTML = home.featured_cards
        .map(function (card) {
          var title = textByLang(card.title_ar, card.title_en, useEnglish);
          return (
            '<div class="resource-card">' +
            '<a href="' + normalizeHref(card.url) + '">' +
            "<h4>" + title + "</h4>" +
            "</a>" +
            "</div>"
          );
        })
        .join("\n");
    }
  } catch (err) {
    console.warn("Content loader skipped:", err.message);
  }
})();
