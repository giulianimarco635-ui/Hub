import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">
        404 Page Not Found
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been removed or the link might be broken.
      </p>
      
      <Link href="/" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
        Return Home
      </Link>
    </div>
  );
}
