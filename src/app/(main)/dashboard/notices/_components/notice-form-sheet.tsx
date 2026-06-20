"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createNoticeAction, updateNoticeAction } from "@/data/notices/actions";
import {
  NOTICE_CONTENT_MAX,
  NOTICE_TITLE_MAX,
  type NoticeFormValues,
  type NoticeListItem,
  noticeFormSchema,
} from "@/data/notices/schema";

interface NoticeFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 수정 대상. 없으면 생성 모드. */
  notice?: Pick<NoticeListItem, "id" | "title" | "content"> | null;
}

export function NoticeFormSheet({ open, onOpenChange, notice }: NoticeFormSheetProps) {
  const isEdit = Boolean(notice);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: { title: "", content: "" },
  });

  // 시트가 열릴 때마다 대상 값으로 초기화한다.
  React.useEffect(() => {
    if (open) {
      form.reset({ title: notice?.title ?? "", content: notice?.content ?? "" });
    }
  }, [open, notice, form]);

  const onSubmit = (values: NoticeFormValues) => {
    startTransition(async () => {
      const result = notice ? await updateNoticeAction(notice.id, values) : await createNoticeAction(values);

      if (result.success) {
        toast.success(isEdit ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.");
        onOpenChange(false);
      } else {
        toast.error(result.message ?? "처리 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "공지사항 수정" : "공지사항 등록"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "공지사항의 제목과 내용을 수정합니다." : "새로운 공지사항을 등록합니다."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="notice-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4"
        >
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notice-title">제목</FieldLabel>
                  <Input
                    {...field}
                    id="notice-title"
                    placeholder="공지 제목을 입력하세요"
                    maxLength={NOTICE_TITLE_MAX}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notice-content">내용</FieldLabel>
                  <Textarea
                    {...field}
                    id="notice-content"
                    placeholder="공지 내용을 입력하세요"
                    maxLength={NOTICE_CONTENT_MAX}
                    rows={10}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="notice-form" disabled={isPending}>
            {isPending ? "저장 중..." : isEdit ? "수정" : "등록"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              취소
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
