import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - supabase-proxy (rewrite proxy endpoint)
     * - static files - .svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .txt, .xml, .html
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|supabase-proxy|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|html)$).*)",
  ],
};
