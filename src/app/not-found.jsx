import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import CenteredScreen from "@/components/ui/CenteredScreen";
import ErrorScreen, { primaryButtonClass } from "@/components/ui/ErrorScreen";

export const metadata = {
  title: "Page not found",
};

// Any URL the app doesn't have
export default function NotFound() {
  return (
    <CenteredScreen className="max-w-lg">
      <ErrorScreen
        code="404"
        icon={Compass}
        tone="accent"
        title="Page not found"
        text="The page you're looking for doesn't exist or has moved. Check the address, or head back home."
      >
        <Link href="/" className={primaryButtonClass}>
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </ErrorScreen>
    </CenteredScreen>
  );
}
