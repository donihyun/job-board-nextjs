type ContentBlock = {
  _type: string
  _key?: string
  style?: string
  children?: { _type: string; text?: string }[]
}

export function getBlogArticleContent(body: ContentBlock[] = []) {
  // Older generated articles have no block keys; keep their anchors unique too.
  const blocks = body.map((block, index) => ({ ...block, _key: block._key || `generated-block-${index}` }))
  const headings = blocks.flatMap(block => {
    if (block._type !== "block" || !/^h[1-4]$/.test(block.style ?? "")) return []
    const title = (block.children ?? []).filter(child => child._type === "span").map(child => child.text ?? "").join("").trim()
    return title ? [{ id: `section-${block._key}`, title, level: Number(block.style?.slice(1)) }] : []
  })
  return { body: blocks, headings }
}
