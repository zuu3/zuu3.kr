"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";
import { toss } from "./toss-tokens";

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-8" style={{ borderTop: `1px solid ${toss.color.border}` }}>
      {posts.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
          style={{ borderBottom: `1px solid ${toss.color.border}` }}
        >
          <Link href={`/blog/${post.slug}`} className="group/post-item flex items-start justify-between gap-4 py-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[13px] font-medium tabular-nums"
                  style={{ color: toss.color.muted, lineHeight: "19.5px" }}
                >
                  {formatBlogDate(post.date)} · {readingTime(post.content)}분 읽기
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[13px] font-semibold"
                    style={{ color: toss.color.weakFg, backgroundColor: toss.color.weakBg, borderRadius: toss.radius.sm, padding: "2px 6px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p
                className="mt-1.5 font-semibold tracking-tight group-hover/post-item:underline"
                style={{ color: toss.color.foreground, fontSize: 24, lineHeight: "36px" }}
              >
                {post.title}
              </p>
              <p
                className="mt-1 max-w-xl"
                style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}
              >
                {post.excerpt}
              </p>
            </div>
            <ArrowRight
              className="mt-2 h-4 w-4 shrink-0 transition-transform group-hover/post-item:translate-x-0.5"
              style={{ color: toss.color.muted }}
              strokeWidth={1.75}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
