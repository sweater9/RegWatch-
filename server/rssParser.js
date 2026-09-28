// Minimal, dependency-free RSS 2.0 / Atom parser. Good enough for regulator
// feeds, which are simple and well-formed; not a general-purpose XML parser.

function decode(s) {
  return (s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function attr(block, name, attrName) {
  const m = block.match(new RegExp(`<${name}[^>]*\\s${attrName}="([^"]*)"`, "i"));
  return m ? m[1] : "";
}

function parseFeed(xml) {
  const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
  const itemTag = isAtom ? "entry" : "item";
  const re = new RegExp(`<${itemTag}[^>]*>([\\s\\S]*?)</${itemTag}>`, "gi");
  const items = [];
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const title = tag(block, "title");
    let link = tag(block, "link");
    if (isAtom && !link) link = attr(block, "link", "href");
    const dateStr = isAtom
      ? tag(block, "updated") || tag(block, "published")
      : tag(block, "pubDate") || tag(block, "dc:date");
    const summary = tag(block, "description") || tag(block, "summary") || tag(block, "content");
    const parsedDate = dateStr ? new Date(dateStr) : null;
    items.push({
      title,
      link,
      date: parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null,
      summary: summary ? summary.slice(0, 280) : "",
    });
  }
  return items;
}

module.exports = { parseFeed };
