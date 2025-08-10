import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlockedPage() {
  return (
    <div className="font-sans min-h-screen p-6 sm:p-10 grid place-items-center">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-xl">YouTube is blocked</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/70 dark:text-white/70">
            This route provides a friendly message within the app. If you installed the Chrome extension, it will
            redirect directly to its own internal blocked page. You can always come back to the dashboard to check in.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
