import { NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fruit    = searchParams.get("fruit") ?? "";
  const question = searchParams.get("question") ?? "";

  const url = `${BACKEND}/fruit-query?fruit=${encodeURIComponent(fruit)}&question=${encodeURIComponent(question)}`;
  try {
    const upstream = await fetch(url, { headers: { Accept: "text/event-stream" } });
    return new Response(upstream.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch {
    return new Response("Backend unavailable", { status: 503 });
  }
}
