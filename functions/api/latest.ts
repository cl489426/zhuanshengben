const OFFICIAL_INDEX = "https://www.sneea.cn/zc/zsbks.htm";

type Notice = { title: string; url: string };

const fallback: Notice[] = [
  { title: "2026年陕西省普通高等学校专升本录取工作结束", url: "https://www.sneea.cn/info/1031/17554.htm" },
  { title: "2026年陕西省普通高等学校专升本考试招生工作实施办法", url: "https://www.sneea.cn/info/1031/17033.htm" },
];

export const onRequestGet = async () => {
  const checkedAt = new Date().toISOString();
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=300",
    "access-control-allow-origin": "*",
  };

  try {
    const response = await fetch(OFFICIAL_INDEX, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; StudyMapUpdateChecker/1.0)" },
    });
    if (!response.ok) throw new Error(`Official site returned ${response.status}`);
    const html = new TextDecoder("utf-8").decode(await response.arrayBuffer());
    const matches = [...html.matchAll(/<a[^>]+href="([^"]*info\/1031\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    const notices: Notice[] = [];
    const seen = new Set<string>();

    for (const match of matches) {
      const title = match[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      const url = new URL(match[1], OFFICIAL_INDEX).toString();
      if (title && !seen.has(url)) {
        notices.push({ title, url });
        seen.add(url);
      }
      if (notices.length === 5) break;
    }
    if (!notices.length) throw new Error("No notices found");

    return new Response(JSON.stringify({
      status: "live",
      checkedAt,
      has2027Notice: notices.some((item) => item.title.includes("2027") && item.title.includes("专升本")),
      notices,
    }), { headers });
  } catch {
    return new Response(JSON.stringify({ status: "fallback", checkedAt, has2027Notice: false, notices: fallback }), { headers });
  }
};
