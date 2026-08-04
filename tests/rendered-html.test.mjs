import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Shaanxi 2027 science study map", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>升本地图｜陕西专升本学习资源与备考路线<\/title>/);
  assert.match(html, /陕西理工类专属/);
  assert.match(html, /大学英语 \+ 高等数学/);
  assert.match(html, /核心词汇与词法/);
  assert.match(html, /向量代数与空间解析几何/);
  assert.match(html, /2027 正式公告暂未检测到/);
  assert.doesNotMatch(html, /文史 \/ 医学 \/ 艺术|大学语文|完形填空/);
});

test("keeps course links and official baseline in source", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /https:\/\/www\.sneea\.cn\/info\/1031\/17033\.htm/);
  assert.match(page, /BV1yR4y117yx/);
  assert.match(page, /BV1HP411t7cS/);
  assert.match(page, /BV1w4ymBjE3C/);
  assert.match(page, /english-course-question-bank\.pdf/);
  assert.match(page, /math-course-question-bank\.pdf/);
  assert.doesNotMatch(page, /type: "语文"|title: "完形填空"/);
  assert.match(layout, /面向 2027 陕西统招专升本考生/);
});
