"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 divide-y divide-neutral-200">
      {posts.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group/post-item flex items-start justify-between gap-4 py-6 first:pt-0"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <span className="tabular-nums">{formatBlogDate(post.date)}</span>
                <span>·</span>
                <span>{readingTime(post.content)}분 읽기</span>
                {post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{post.tags.join(" ")}</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-neutral-900 group-hover/post-item:text-[#ff6f0f] md:text-2xl">
                {post.title}
              </p>
              <p className="mt-1.5 max-w-xl text-base leading-relaxed text-neutral-600">{post.excerpt}</p>
            </div>
            <ArrowRight
              className="mt-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover/post-item:translate-x-0.5 group-hover/post-item:text-[#ff6f0f]"
              strokeWidth={1.75}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
