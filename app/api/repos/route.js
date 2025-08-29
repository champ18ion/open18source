// app/api/repos/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "language:javascript";
  const page = searchParams.get("page") || 1;
  const per_page = searchParams.get("per_page") || 20;
  const sort = searchParams.get("sort") || "stars";
  const order = searchParams.get("order") || "desc";

  const res = await fetch(
    `https://api.github.com/search/repositories?q=${q}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const data = await res.json();

  return NextResponse.json({
    ok: true,
    q,
    sort,
    order,
    page: Number(page),
    per_page: Number(per_page),
    total_count: data.total_count,
    repos: data.items,
    ratelimit: {
      limit: res.headers.get("x-ratelimit-limit"),
      remaining: res.headers.get("x-ratelimit-remaining"),
      reset: res.headers.get("x-ratelimit-reset"),
      used: res.headers.get("x-ratelimit-used"),
    },
  });
}
