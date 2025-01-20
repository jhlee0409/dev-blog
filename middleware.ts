import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// URL 매핑 테이블
const redirectMap: Record<string, string> = {
  "/서적/두려움이+없는+조직": "/blog/fearless-org",
  // 추가적인 리디렉션 규칙들을 여기에 추가할 수 있습니다
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = decodeURIComponent(url.pathname);

  // redirectMap에서 매칭되는 경로 찾기
  const redirectTo = redirectMap[path];

  if (redirectTo) {
    // 영구적인 리디렉션을 위해 308 상태 코드 사용
    return NextResponse.redirect(new URL(redirectTo, request.url), 308);
  }

  // 매칭되는 리디렉션 규칙이 없으면 요청을 그대로 진행
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: "/:path*",
};
