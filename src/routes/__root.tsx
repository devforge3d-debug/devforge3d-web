import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-gradient">404</h1>
          <p className="mt-4 text-muted-foreground">Az oldal nem található.</p>
          <Link to="/" className="mt-6 inline-block px-6 py-2 rounded-md bg-primary text-primary-foreground">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Hiba történt</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Újrapróbálás
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevForge3D Development — FiveM Team" },
      { name: "description", content: "DevForge3D — FiveM development csapat. 3D nyomtatás, weboldal készítés, egyedi szkriptek és digitális megoldások." },
      { property: "og:title", content: "DevForge3D Development — FiveM Team" },
      { property: "og:description", content: "DevForge3D — FiveM development csapat. 3D nyomtatás, weboldal készítés, egyedi szkriptek és digitális megoldások." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "DevForge3D Development — FiveM Team" },
      { name: "twitter:description", content: "DevForge3D — FiveM development csapat. 3D nyomtatás, weboldal készítés, egyedi szkriptek és digitális megoldások." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0eb18bb0-f5d6-4fba-a2e1-f3df3d1d3483/id-preview-669bb531--c7563d66-500b-451e-a763-bd85b2c8bb1b.lovable.app-1778314784730.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0eb18bb0-f5d6-4fba-a2e1-f3df3d1d3483/id-preview-669bb531--c7563d66-500b-451e-a763-bd85b2c8bb1b.lovable.app-1778314784730.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
