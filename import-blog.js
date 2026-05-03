import fs from "fs";
import path from "path";
import xml2js from "xml2js";

const xml = fs.readFileSync("./feed.xml", "utf8");
const parser = new xml2js.Parser();

parser.parseString(xml, (err, result) => {
    if (err) {
        console.error("XML parse error:", err);
        return;
    }
    const entries = result.feed.entry || [];
    entries.forEach(entry => {
        try {
            // Skip non-LIVE entries
            const status = entry["blogger:status"]?.[0];
            if (status !== "LIVE") return;

            const title = entry.title?.[0]?.trim() || "Untitled";
            const published = entry.published?.[0] || entry["blogger:created"]?.[0];
            const date = published ? new Date(published).toISOString() : new Date().toISOString();

            // Content
            const contentObj = entry.content?.[0];
            const html = typeof contentObj === "string" ? contentObj : contentObj?._ || "";
            const plain = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
            const description = plain.length > 200 ? plain.slice(0, 200) + "…" : plain;

            // Categories – guard against missing category array
            const categories = (entry.category || [])
            .filter(c => c && c.$ && c.$.term)
            .map(c => c.$.term);

            // Slug from filename or title
            const filename = entry["blogger:filename"]?.[0] || "";
            let slug = "";
            if (filename) {
                const parts = filename.split("/");
                slug = parts[parts.length - 1]?.replace(/\.html$/, "") || "";
            }
            if (!slug) {
                slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            }
            if (!slug) return;

            const dirPath = "src/content/blog/en";
            const filePath = path.join(dirPath, `${slug}.md`);

            // Frontmatter
            const frontmatter = [
                "---",
                `title: "${title.replace(/"/g, '\\"')}"`,
                    `date: "${date}"`,
                    `description: "${description.replace(/"/g, '\\"')}"`,
                    `tags: [${categories.map(t => `"${t}"`).join(", ")}]`,
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
