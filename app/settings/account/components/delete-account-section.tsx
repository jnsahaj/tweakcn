"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { deleteAccount } from "@/actions/account";

const CONFIRMATION_TEXT = "DELETE";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const posthog = usePostHog();

  const isConfirmed = confirmText === CONFIRMATION_TEXT;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    const result = await deleteAccount();

    if (result.success) {
      posthog.reset();
      await authClient.signOut();
      router.push("/");
    } else {
      toast({
        title: "Failed to delete account",
        description: result.error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="border-destructive/50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => setOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={(v) => {
        if (!isDeleting) {
          setOpen(v);
          if (!v) setConfirmText("");
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              Delete your account
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  This will permanently delete your account and all associated
                  data, including:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>All saved themes</li>
                  <li>Community published themes</li>
                  <li>AI usage history</li>
                  <li>Active subscription (if any)</li>
                </ul>
                <p className="font-medium">This action cannot be undone.</p>
                <div className="pt-1">
                  <label
                    htmlFor="confirm-delete"
                    className="text-sm font-medium"
                  >
                    Type <span className="font-mono font-bold">{CONFIRMATION_TEXT}</span> to
                    confirm
                  </label>
                  <Input
                    id="confirm-delete"
                    className="mt-1.5"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={CONFIRMATION_TEXT}
                    disabled={isDeleting}
                    autoComplete="off"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
