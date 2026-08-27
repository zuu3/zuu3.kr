"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Badge as SeedBadge } from "@seed-design/react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate, readingTime, tagTone } from "@/lib/blog";

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 flex flex-col gap-4">
      {posts.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
        >
          <Link href={`/blog/${post.slug}`} className="group/post-item block">
            <Card className="rounded-2xl border-none py-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <CardContent className="flex items-start gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold tracking-wide text-neutral-500 tabular-nums uppercase">
                      {formatBlogDate(post.date)}
                    </span>
                    <span className="text-xs font-bold text-neutral-300">·</span>
                    <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
                      {readingTime(post.content)}분 읽기
                    </span>
                    {post.tags.map((tag) => (
                      <SeedBadge key={tag} tone={tagTone(tag)} variant="weak" size="medium">
                        {tag}
                      </SeedBadge>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xl font-bold tracking-tight text-neutral-900 group-hover/post-item:text-[#ff6f0f] md:text-2xl">
                    {post.title}
                  </p>
                  <p className="mt-1.5 text-base leading-relaxed text-neutral-600">{post.excerpt}</p>
                </div>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 self-center text-neutral-400 transition-transform group-hover/post-item:translate-x-0.5 group-hover/post-item:text-[#ff6f0f]"
                  strokeWidth={1.75}
                />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
