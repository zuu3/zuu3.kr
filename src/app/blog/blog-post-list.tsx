"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";
import { toss } from "./toss-tokens";

// 실제 삽화 대신, 글마다 고정 그라디언트 썸네일을 결정론적으로 배정.
const THUMBNAIL_GRADIENTS = [
  "linear-gradient(135deg, #3182f6, #6699ff)",
  "linear-gradient(135deg, #c8b6ff, #ffd6e8)",
  "linear-gradient(135deg, #0a2540, #1b3a63)",
];

function thumbnailFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return THUMBNAIL_GRADIENTS[hash % THUMBNAIL_GRADIENTS.length];
}

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-10 flex flex-col gap-10">
      {posts.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
        >
          <Link href={`/blog/${post.slug}`} className="group/post-item flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[13px] font-semibold"
                    style={{
                      color: toss.color.body,
                      backgroundColor: toss.color.surface,
                      borderRadius: "999px",
                      padding: "4px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p
                className="mt-3 font-bold tracking-tight group-hover/post-item:underline"
                style={{ color: toss.color.foreground, fontSize: 22, lineHeight: "31px" }}
              >
                {post.title}
              </p>
              <p className="mt-2 max-w-md" style={{ color: toss.color.body, fontSize: 15, lineHeight: "22px" }}>
                {post.excerpt}
              </p>
              <p className="mt-3 text-[13px] font-medium tabular-nums" style={{ color: toss.color.muted }}>
                {formatBlogDate(post.date)} · {readingTime(post.content)}분 읽기
              </p>
            </div>
            <div
              className="hidden h-[130px] w-[200px] shrink-0 sm:block"
              style={{ background: thumbnailFor(post.slug), borderRadius: toss.radius.md }}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
