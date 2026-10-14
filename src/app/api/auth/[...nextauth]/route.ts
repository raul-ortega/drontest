import { handleAuth } from "@/lib/auth";

export async function GET(request: Request) {
  return handleAuth(request);
}

export async function POST(request: Request) {
  return handleAuth(request);
}
