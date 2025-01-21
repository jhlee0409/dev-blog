import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// URL 매핑 테이블
const redirectMap: Record<string, string> = {
  "/서적/두려움이+없는+조직": "/blog/fearless-org",
  "/회고/2024+Recap": "/blog/2024-recap",
  "/항해+플러스+3기/항해플러스의+두+번째+코스%2C+클린코드를+마치며+-+FSD+편":
    "/blog/hanghae-3rd-fsd",
  "%ED%95%AD%ED%95%B4+%ED%94%8C%EB%9F%AC%EC%8A%A4+3%EA%B8%B0/%ED%95%AD%ED%95%B4%ED%94%8C%EB%9F%AC%EC%8A%A4%EC%9D%98+%EB%91%90+%EB%B2%88%EC%A7%B8+%EC%BD%94%EC%8A%A4%2C+%ED%81%B4%EB%A6%B0%EC%BD%94%EB%93%9C%EB%A5%BC+%EB%A7%88%EC%B9%98%EB%A9%B0+-+FSD+%ED%8E%B8":
    "/blog/hanghae-3rd-fsd",
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
