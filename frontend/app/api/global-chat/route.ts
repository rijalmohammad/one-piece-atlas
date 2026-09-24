import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get("question");

  if (!question) {
    return new Response("Missing question", { status: 400 });
  }

  const params = new URLSearchParams({ question });
  const upstream = await fetch(`${BACKEND_URL}/global-query?${params}`, {
    method: "GET",
    headers: { Accept: "text/event-stream" },
  });

  if (!upstream.ok) {
    return new Response("Backend error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
