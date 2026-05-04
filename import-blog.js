import fs from "fs";
import path from "path";
import xml2js from "xml2js";

const xml = fs.readFileSync("./feed.xml", "utf8");
const parser = new xml2js.Parser();

const hasArabic = (text = "") => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

parser.parseString(xml, (err, result) => {
    if (err) {
        console.error("XML parse error:", err);
        return;
    }

    const entries = result.feed.entry || [];
    entries.forEach((entry) => {
        try {
            const status = entry["blogger:status"]?.[0];
            if (status !== "LIVE") return;

            const title = entry.title?.[0]?.trim() || "Untitled";
            const published = entry.published?.[0] || entry["blogger:created"]?.[0];
            const date = published ? new Date(published).toISOString() : new Date().toISOString();

            const contentObj = entry.content?.[0];
            const html = typeof contentObj === "string" ? contentObj : contentObj?._ || "";
            const plain = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
            const description = plain.length > 200 ? plain.slice(0, 200) + "…" : plain;

            const categories = (entry.category || [])
                .filter((c) => c && c.$ && c.$.term)
                .map((c) => c.$.term);

            const filename = entry["blogger:filename"]?.[0] || "";
            let slug = "";
            if (filename) {
                const parts = filename.split("/");
                slug = parts[parts.length - 1]?.replace(/\.html$/, "") || "";
            }
            if (!slug) {
                slug = slugify(title);
            }
            if (!slug) return;

            const isArabic = hasArabic(html + title + plain);
            const dirPath = isArabic ? "src/content/blog/ar" : "src/content/blog/en";
            const filePath = path.join(dirPath, `${slug}.md`);

            const frontmatter = [
                "---",
                `title: "${title.replace(/"/g, '\\"')}",`,
                `date: "${date}",`,
                `description: "${description.replace(/"/g, '\\"')}",`,
                `tags: [${categories.map((t) => `"${t}"`).join(", ")}],`,
                `featured: false`,
                "---",
                "",
                html,
            ].join("\n");

            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, frontmatter, "utf8");
            console.log(`✅ Created ${filePath}`);
        } catch (entryErr) {
            console.error("Error processing entry:", entry.title?.[0], entryErr);
        }
    });

    console.log("🎉 Import complete.");
});
