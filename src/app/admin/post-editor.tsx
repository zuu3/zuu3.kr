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
import { BlogMarkdown } from "@/app/blog/blog-markdown";
import { toss } from "@/app/blog/toss-tokens";
import type { Post } from "@/lib/posts";
import { usePostForm } from "./use-post-form";
import { useImageUpload } from "./use-image-upload";
import { useConfirmDialog, ConfirmDialog } from "./use-confirm-dialog";
import { PostSettingsPanel } from "./post-settings-panel";
import { useLocalBackup } from "./use-local-backup";

function ToolbarButton({
  icon: Icon,
  title,
  onClick,
}: {
  icon: typeof Bold;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // 클릭 시 textarea가 blur되면 selectionStart/End가 초기화되므로
      // mousedown에서 막아 포커스가 그대로 유지되게 한다.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1.5 h-5 w-px shrink-0 bg-neutral-200" />;
}

const TABLE_PICKER_MAX = 6;

// Notion/구글 문서처럼 격자에서 칸 수를 마우스로 훑어 고르는 표 삽입 UI.
// 행/열 개수를 숫자로 입력하게 하는 것보다 훨씬 빠르고, 결과 크기를 바로
// 눈으로 보면서 고를 수 있다.
function TableSizePicker({ onPick, onClose }: { onPick: (rows: number, cols: number) => void; onClose: () => void }) {
  const [hover, setHover] = useState({ rows: 2, cols: 2 });

  return (
    <div className="absolute top-full left-0 z-10 mt-1 rounded-md border border-neutral-200 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs text-neutral-400">
        {hover.rows} x {hover.cols} 표
      </p>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${TABLE_PICKER_MAX}, 1fr)` }}
        onMouseLeave={() => setHover({ rows: 2, cols: 2 })}
      >
        {Array.from({ length: TABLE_PICKER_MAX * TABLE_PICKER_MAX }, (_, i) => {
          const row = Math.floor(i / TABLE_PICKER_MAX) + 1;
          const col = (i % TABLE_PICKER_MAX) + 1;
          const active = row <= hover.rows && col <= hover.cols;
          return (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHover({ rows: row, cols: col })}
              onClick={() => {
                onPick(row, col);
                onClose();
              }}
              className={`h-4 w-4 rounded-sm border ${
                active ? "border-transparent" : "border-neutral-200 bg-neutral-50"
              }`}
              style={active ? { backgroundColor: toss.color.primary } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

// 파일 업로드 vs 이미 웹에 있는 이미지 URL 붙여넣기, 두 선택지를 준다.
// 이전엔 버튼 클릭 = 바로 파일 선택창이라 URL 하나 있는 이미지도 무조건
// 로컬에 저장했다가 올려야 했다.
function ImagePicker({
  uploading,
  onUploadFile,
  onInsertUrl,
  onClose,
}: {
  uploading: boolean;
  onUploadFile: (file: File) => void;
  onInsertUrl: (url: string, alt: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"choose" | "url">("choose");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <div className="absolute top-full left-0 z-10 mt-1 w-64 rounded-md border border-neutral-200 bg-white p-3 shadow-lg">
      {mode === "choose" ? (
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            <ImagePlus size={15} strokeWidth={1.75} />
            {uploading ? "업로드 중..." : "파일 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadFile(file);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setMode("url")}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <Link2 size={15} strokeWidth={1.75} />
            URL로 추가
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="설명 (alt, 선택)"
            className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!url.trim()}
              onClick={() => onInsertUrl(url.trim(), alt.trim())}
              className="rounded-md px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
              style={{ backgroundColor: toss.color.primary }}
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      className="flex h-svh flex-col"
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
