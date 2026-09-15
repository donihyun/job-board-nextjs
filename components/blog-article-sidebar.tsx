"use client"

import { useEffect, useState } from "react"
import { Check, Facebook, Link2, Linkedin } from "lucide-react"
import type { getBlogArticleContent } from "@/lib/blog-headings"
import styles from "./blog.module.css"

export function BlogArticleSidebar({ headings }: { headings: ReturnType<typeof getBlogArticleContent>["headings"] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "")
  const [url, setUrl] = useState("")
  const [copyStatus, setCopyStatus] = useState("")

  useEffect(() => {
    setUrl(window.location.href.split("#")[0])
    const sections = headings.map(heading => document.getElementById(heading.id)).filter((section): section is HTMLElement => section !== null)
    const updateActive = () => {
      let current = sections[0]?.id ?? ""
      for (const section of sections) {
        if (section.getBoundingClientRect().top > 96) break
        current = section.id
      }
      setActiveId(current)
    }
    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)
    return () => {
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
    }
  }, [headings])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus("Link copied")
    } catch {
      setCopyStatus("Couldn't copy. Copy the link from your address bar.")
    }
  }

  return (
    <aside className={styles.articleSidebar} aria-label="Article tools">
      {headings.length > 0 && (
        <nav className={styles.articleToc} aria-label="On this page">
          <ol>
            {headings.map(heading => (
              <li key={heading.id}>
                <a href={`#${heading.id}`} aria-current={activeId === heading.id ? "location" : undefined} className={heading.level > 2 ? styles.tocSubheading : undefined}>
                  {heading.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={styles.articleShare}>
        <p>Share Article</p>
        <div className={styles.shareButtons}>
          <button type="button" onClick={copyLink} disabled={!url} aria-label="Copy article link" title="Copy article link" className={styles.shareCopy}>
            {copyStatus === "Link copied" ? <Check size={16} /> : <Link2 size={16} />}
          </button>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)" title="Share on LinkedIn" className={styles.shareLinkedin}><Linkedin size={16} /></a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens in a new tab)" title="Share on Facebook" className={styles.shareFacebook}><Facebook size={16} /></a>
        </div>
        <p role="status" className={styles.shareStatus}>{copyStatus}</p>
      </div>
    </aside>
  )
}
