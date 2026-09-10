"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  Code,
  Code2,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  Quote,
  Settings2,
  Table2,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BlogMarkdown } from "@/app/blog/_components/blog-markdown";
import { toss } from "@/app/blog/toss-tokens";
import type { Post } from "@/lib/posts";
import { usePostForm } from "@/app/admin/_hooks/use-post-form";
import { useImageUpload } from "@/app/admin/_hooks/use-image-upload";
import { useConfirmDialog, ConfirmDialog } from "@/app/admin/_components/confirm-dialog";
import { PostSettingsPanel } from "@/app/admin/_components/post-settings-panel";
import { useLocalBackup } from "@/app/admin/_hooks/use-local-backup";
import { ToolbarButton, ToolbarDivider } from "./toolbar-button";
import { TableSizePicker } from "./table-size-picker";
import { ImagePicker } from "./image-picker";

export function PostEditor({
  post,
  existingTags,
  onDone,
}: {
  post: Post | null;
  existingTags: string[];
  onDone: () => void;
}) {
  const {
    slug,
    title,
    excerpt,
    setExcerpt,
    tags,
    setTags,
    currentTagList,
    addTag,
    content,
    setContent,
    isDirty,
    textareaRef,
    handleTitleChange,
    handleSlugChange,
    replaceSelection,
    wrapSelection,
    insertTable,
    toRow,
    restoreFrom,
    commitSaved,
  } = usePostForm(post);
  const imageUpload = useImageUpload();
  const confirmDialog = useConfirmDialog();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  // 저장 뒤에도 에디터에 계속 머무른다 - post prop은 처음 열었을 때 값에
  // 고정돼있어서, "지금 이 글이 실제로 어느 상태인지"(발행 여부, 존재하는
  // 슬러그인지)는 저장할 때마다 이걸로 갱신해서 따라간다. 이게 없으면
  // 새 글을 저장한 뒤 또 저장 누를 때 insert를 다시 시도해 슬러그 중복
  // 에러가 난다.
  const [effectivePost, setEffectivePost] = useState<Post | null>(post);

  const localBackup = useLocalBackup(
    `admin-draft-backup:${effectivePost?.slug ?? "new"}`,
    { title, excerpt, tags, content },
    true,
  );

  // 마운트 시 한 번만: 서버에서 불러온 내용과 다른 로컬 백업이 있으면
  // 복구할지 물어본다. 이후 타이핑에 반응하면 안 되니 ref로 한 번만
  // 걸어둔다.
  const askedBackupRef = useRef(false);
  useEffect(() => {
    if (askedBackupRef.current) return;
    askedBackupRef.current = true;
    const backup = localBackup.readBackup();
    if (!backup) return;
    const sameAsLoaded =
      backup.title === (post?.title ?? "") &&
      backup.excerpt === (post?.excerpt ?? "") &&
      backup.tags === (post?.tags.join(", ") ?? "") &&
      backup.content === (post?.content ?? "");
    if (sameAsLoaded) {
      localBackup.clearBackup();
      return;
    }
    const savedAgo = Math.max(1, Math.round((Date.now() - backup.savedAt) / 60000));
    confirmDialog.ask({
      title: "저장 안 된 내용이 남아있어요",
      description: `${savedAgo}분 전 브라우저에 남겨둔 임시 내용이 있어요. 불러올까요?`,
      confirmLabel: "불러오기",
      onConfirm: () => restoreFrom(backup),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBack() {
    if (isDirty) {
      confirmDialog.ask({
        title: "나가시겠어요?",
        description: "저장하지 않은 수정 내용은 사라져요.",
        confirmLabel: "나가기",
        onConfirm: onDone,
      });
      return;
    }
    onDone();
  }

  async function handleImageUpload(file: File) {
    const url = await imageUpload.upload(file);
    if (!url) return;
    // alt가 계속 비어 있으면 스크린리더도, 이미지 검색 SEO도 못 챙긴다.
    // 파일명을 그대로 기본값으로 넣어두고, 마음에 안 들면 본문에서 직접
    // 대괄호 안을 고치면 된다 - 업로드 때마다 입력창을 띄우지 않는다.
    const defaultAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    replaceSelection(`![${defaultAlt}](${url})`);
  }

  async function save(nextStatus: "draft" | "published") {
    if (!slug || !title) {
      setSettingsOpen(true);
      setError("제목이랑 슬러그를 먼저 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);
    const row = toRow(nextStatus, effectivePost);
    const { error } = effectivePost
      ? await supabase.from("posts").update(row).eq("slug", effectivePost.slug)
      : await supabase.from("posts").insert(row);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    localBackup.clearBackup();
    commitSaved(row.tags);
    // updated_at은 DB 트리거가 now()로 채운다(posts_set_updated_at) - 여기선
    // 왕복 재조회 없이 거의 같은 값으로 근사한다.
    setEffectivePost({ ...row, updated_at: new Date().toISOString() });
    // 문서 편집기처럼 저장 후에도 계속 편집할 수 있게 목록으로 안 나간다.
    // "저장 안 됨" 표시가 사라지는 것만으론 저장됐는지 확실히 안 보여서
    // 잠깐 "저장됨"을 띄워준다.
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  async function doRemove() {
    if (!effectivePost) return;
    setSaving(true);
    const { error } = await supabase.from("posts").delete().eq("slug", effectivePost.slug);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onDone();
  }

  function remove() {
    if (!effectivePost) return;
    confirmDialog.ask({
      title: "글을 삭제할까요?",
      description: `"${effectivePost.title}"은(는) 복구할 수 없어요.`,
      confirmLabel: "삭제",
      onConfirm: doRemove,
    });
  }

  return (
    <div
      className="blog-scope flex h-svh flex-col"
      data-theme="light"
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          save("draft");
        }
      }}
    >
      {/* 상단 바 - 제목만 크게, 슬러그/태그/요약은 오른쪽 슬라이드 패널로 뺀다 */}
      <header className="flex shrink-0 items-center gap-3 border-b border-neutral-200 px-5 py-3">
        <button
          onClick={handleBack}
          aria-label="목록으로"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className="min-w-0 flex-1 border-none text-lg font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
        />
        {savedFlash ? (
          <span className="shrink-0 text-xs font-bold" style={{ color: "#15803d" }}>
            저장됨
          </span>
        ) : (
          isDirty && <span className="shrink-0 text-xs text-neutral-400">저장 안 됨</span>
        )}
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={
            (effectivePost?.status ?? "draft") === "published"
              ? { color: "#15803d", backgroundColor: "#f0fdf4" }
              : { color: toss.color.muted, backgroundColor: toss.color.surface }
          }
        >
          {(effectivePost?.status ?? "draft") === "published" ? "발행됨" : "임시글"}
        </span>
        {effectivePost && (
          <a
            href={`/blog/${effectivePost.slug}/preview`}
            target="_blank"
            rel="noreferrer"
            aria-label="미리보기"
            title="실제 페이지로 미리보기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <Eye size={16} strokeWidth={1.75} />
          </a>
        )}
        <button
          onClick={() => setSettingsOpen((s) => !s)}
          aria-label="정보"
          title="슬러그·태그·요약"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 ${
            settingsOpen ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <Settings2 size={16} strokeWidth={1.75} />
        </button>
        {effectivePost && (
          <button
            onClick={remove}
            aria-label="삭제"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} strokeWidth={1.75} />
          </button>
        )}
        {effectivePost?.status === "published" ? (
          // 이미 발행된 글은 "저장" 하나만 - 여기서 "임시저장"을 눌러버리면
          // 실수로 공개 글이 내려가는 위험한 버튼이 된다. 상태는 그대로
          // 두고 내용만 갱신한다.
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="shrink-0 rounded-md px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
            style={{ backgroundColor: toss.color.primary }}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        ) : (
          <>
            <button
              onClick={() => save("draft")}
              disabled={saving}
              className="shrink-0 rounded-md px-3.5 py-1.5 text-sm font-bold transition-colors hover:bg-neutral-100 disabled:opacity-50"
              style={{ color: toss.color.body }}
            >
              임시저장
            </button>
            <button
              onClick={() => save("published")}
              disabled={saving}
              className="shrink-0 rounded-md px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
              style={{ backgroundColor: toss.color.primary }}
            >
              {saving ? "저장 중..." : "발행"}
            </button>
          </>
        )}
      </header>

      {/* 좌우 분할 - 왼쪽 타이핑하면 오른쪽에 바로 렌더링. 미리보기 토글 없앰 */}
      <div className="grid min-h-0 flex-1 grid-cols-2">
        <div className="flex min-h-0 flex-col border-r border-neutral-200">
          <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50/60 px-3 py-2">
            <ToolbarButton icon={Heading2} title="소제목" onClick={() => replaceSelection("## ")} />
            <ToolbarButton icon={Heading3} title="작은 소제목" onClick={() => replaceSelection("### ")} />
            <ToolbarDivider />
            <ToolbarButton icon={Bold} title="굵게" onClick={() => wrapSelection("**", "**")} />
            <ToolbarButton icon={Italic} title="기울임" onClick={() => wrapSelection("*", "*")} />
            <ToolbarButton icon={Code} title="인라인 코드" onClick={() => wrapSelection("`", "`")} />
            <ToolbarDivider />
            <ToolbarButton icon={Code2} title="코드 블록" onClick={() => replaceSelection("```\n\n```", 4)} />
            <ToolbarButton icon={List} title="목록" onClick={() => replaceSelection("- ")} />
            <ToolbarButton icon={Quote} title="인용구" onClick={() => replaceSelection("> ")} />
            <ToolbarButton icon={Link2} title="링크" onClick={() => replaceSelection("[텍스트](https://)", 1)} />
            <div className="relative">
              <ToolbarButton icon={Table2} title="표" onClick={() => setTablePickerOpen((o) => !o)} />
              {tablePickerOpen && (
                <TableSizePicker
                  onPick={insertTable}
                  onClose={() => setTablePickerOpen(false)}
                />
              )}
            </div>
            <ToolbarDivider />
            <div className="relative">
              <ToolbarButton
                icon={ImagePlus}
                title="이미지"
                onClick={() => setImagePickerOpen((o) => !o)}
              />
              {imagePickerOpen && (
                <ImagePicker
                  uploading={imageUpload.uploading}
                  onUploadFile={(file) => {
                    setImagePickerOpen(false);
                    handleImageUpload(file);
                  }}
                  onInsertUrl={(url, alt) => {
                    setImagePickerOpen(false);
                    replaceSelection(`![${alt}](${url})`);
                  }}
                  onClose={() => setImagePickerOpen(false)}
                />
              )}
            </div>
            {imageUpload.uploading && <span className="ml-1 text-xs text-neutral-400">업로드 중...</span>}
          </div>
          <textarea
            ref={textareaRef}
            placeholder="마크다운으로 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              // 툴바 버튼만으로 서식 넣는 건 마크다운 에디터치고 기본기가
              // 없는 느낌이라, 흔히 기대하는 단축키 몇 개만 잡는다.
              const mod = e.metaKey || e.ctrlKey;
              if (!mod) return;
              if (e.key === "b") {
                e.preventDefault();
                wrapSelection("**", "**");
              } else if (e.key === "i") {
                e.preventDefault();
                wrapSelection("*", "*");
              } else if (e.key === "k") {
                e.preventDefault();
                replaceSelection("[텍스트](https://)", 1);
              } else if (e.key === "e") {
                e.preventDefault();
                wrapSelection("`", "`");
              }
            }}
            className="min-h-0 flex-1 resize-none px-6 py-5 font-mono text-sm leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-300"
          />
        </div>
        <div className="min-h-0 overflow-y-auto px-8 py-6">
          {content ? (
            <BlogMarkdown content={content} />
          ) : (
            <p className="text-sm text-neutral-300">미리보기가 여기 표시됩니다</p>
          )}
        </div>
      </div>

      <PostSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        error={error}
        slug={slug}
        onSlugChange={handleSlugChange}
        tags={tags}
        onTagsChange={setTags}
        existingTags={existingTags}
        currentTagList={currentTagList}
        onAddTag={addTag}
        excerpt={excerpt}
        onExcerptChange={setExcerpt}
      />

      <ConfirmDialog
        state={confirmDialog.state}
        onCancel={confirmDialog.cancel}
        onConfirm={confirmDialog.confirmAndClose}
      />
    </div>
  );
}
