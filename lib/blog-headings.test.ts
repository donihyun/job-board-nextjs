import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's strip-types runner requires the explicit extension.
import { getBlogArticleContent } from "./blog-headings.ts"

test("article headings preserve text and use unique block keys for anchors", () => {
  const heading = { _type: "block", style: "h2", children: [{ _type: "span", text: "Finding " }, { _type: "span", text: "jobs" }] }
  const content = getBlogArticleContent([
    { ...heading, _key: "first" },
    { ...heading, _key: "second", style: "h3" },
    { ...heading, _key: "paragraph", style: "normal" },
    { ...heading, _key: "image", _type: "image" },
    { ...heading, _key: "empty", children: [{ _type: "span", text: " " }] },
    { ...heading, _key: "inline-object", children: [{ _type: "image", text: "Ignore" }] },
    heading,
  ])
  assert.deepEqual(content.headings, [
    { id: "section-first", title: "Finding jobs", level: 2 },
    { id: "section-second", title: "Finding jobs", level: 3 },
    { id: "section-generated-block-6", title: "Finding jobs", level: 2 },
  ])
  assert.equal(content.body[6]._key, "generated-block-6")
  assert.equal("_key" in heading, false)
  assert.deepEqual(getBlogArticleContent(), { body: [], headings: [] })
})
