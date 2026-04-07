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

  function normalizeHref(url) {
    if (!url) {
      return "/";
    }
    return url;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value || "";
    }
  }

  function setHTML(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.innerHTML = value || "";
    }
  }

  async function loadJson(path) {
    var res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to load " + path);
    }
    return res.json();
  }

  async function renderAbout(useEnglish) {
    var data = await loadJson("/content/about.json");
    setText("page-title", textByLang(data.title_ar, data.title_en, useEnglish));
    setHTML("page-body", textByLang(data.body_ar, data.body_en, useEnglish));
  }

  async function renderRecommendations(useEnglish) {
    var data = await loadJson("/content/recommendations.json");
    setText("page-title", textByLang(data.title_ar, data.title_en, useEnglish));

    var root = document.getElementById("recommendations-list");
    if (!root) {
      return;
    }

    var grouped = {};
    (data.items || []).forEach(function (item) {
      var key = item.category || "general";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    var sections = Object.keys(grouped).map(function (key) {
      var sectionTitle = key;
      var itemsHtml = grouped[key]
        .map(function (item) {
          var title = textByLang(item.title_ar, item.title_en, useEnglish);
          var note = textByLang(item.note_ar, item.note_en, useEnglish);
          return (
            "<li>" +
            '<a href="' + normalizeHref(item.url) + '">' + title + "</a>" +
            (note ? "<br>" + note : "") +
            "</li>"
          );
        })
        .join("\n");

      return "<h4>" + sectionTitle + "</h4><ul>" + itemsHtml + "</ul>";
    });

    root.innerHTML = sections.join("\n");
  }

  function renderWorksList(data, rootId, useEnglish) {
    var root = document.getElementById(rootId);
    if (!root) {
      return;
    }

    var items = (data.items || []).slice().sort(function (a, b) {
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

    root.innerHTML = items
      .map(function (item) {
        var title = textByLang(item.title_ar, item.title_en, useEnglish);
        var summary = textByLang(item.summary_ar, item.summary_en, useEnglish);
        var href = (item.links && (item.links.site || item.links.external || item.links.download)) || "/";

        return (
          "<li>" +
          '<a href="' + normalizeHref(href) + '">' + title + "</a>" +
          (summary ? "<br>" + summary : "") +
          "</li>"
        );
      })
      .join("\n");
  }

  async function renderBooks(useEnglish) {
    var data = await loadJson("/content/works/books.json");
    renderWorksList(data, "books-list", useEnglish);
  }

  async function renderApps(useEnglish) {
    var data = await loadJson("/content/works/apps.json");
    setText("page-title", textByLang("تطبيقات", "Applications", useEnglish));
    renderWorksList(data, "apps-list", useEnglish);
  }

  async function renderBlogPosts(useEnglish) {
    var data = await loadJson("/content/works/blog-posts.json");
    setText("page-title", textByLang("المدونات", "Blogs", useEnglish));
    renderWorksList(data, "blog-posts-list", useEnglish);
  }

  async function renderTranslations(useEnglish) {
    var data = await loadJson("/content/works/translations.json");
    setText("page-title", textByLang("ترجمات", "Translations", useEnglish));
    renderWorksList(data, "translations-list", useEnglish);
  }

  async function renderCreed(useEnglish) {
    var data = await loadJson("/content/works/creed.json");
    setText("page-title", textByLang("العقيدة", "Creed", useEnglish));
    renderWorksList(data, "creed-list", useEnglish);
  }

  try {
    var site = await loadJson("/content/site.json");
    var useEnglish = isEnglishPreferred(site);
    var path = window.location.pathname;

    if (path.indexOf("/about") === 0) {
      await renderAbout(useEnglish);
    }

    if (path.indexOf("/recommendations") === 0) {
      await renderRecommendations(useEnglish);
    }

    if (path.indexOf("/books") === 0) {
      await renderBooks(useEnglish);
    }

    if (path.indexOf("/apps") === 0) {
      await renderApps(useEnglish);
    }

    if (path.indexOf("/blog") === 0) {
      await renderBlogPosts(useEnglish);
    }

    if (path.indexOf("/translations") === 0) {
      await renderTranslations(useEnglish);
    }

    if (path.indexOf("/creed") === 0) {
      await renderCreed(useEnglish);
    }
  } catch (err) {
    console.warn("Section loader skipped:", err.message);
  }
})();
