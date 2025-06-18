import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // URL 파라미터에서 제목과 설명을 가져옵니다
    const title = searchParams.get('title') || 'Devunpacker';
    const description = searchParams.get('description') || '개발자를 위한 기술 블로그';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* 배경 패턴 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* 메인 컨텐츠 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '80px',
              maxWidth: '900px',
            }}
          >
            {/* 아이콘 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  marginRight: '20px',
                }}
              >
                💻
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  letterSpacing: '-0.02em',
                }}
              >
                Devunpacker
              </div>
            </div>

            {/* 제목 */}
            <div
              style={{
                fontSize: title.length > 30 ? '48px' : '56px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              {title}
            </div>

            {/* 설명 */}
            <div
              style={{
                fontSize: '24px',
                color: '#a0a0a0',
                lineHeight: 1.4,
                textAlign: 'center',
                maxWidth: '700px',
              }}
            >
              {description}
            </div>

            {/* 하단 태그들 */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '40px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {['React', 'Next.js', 'TypeScript', 'Node.js'].map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '16px',
                    color: '#60a5fa',
                    fontWeight: '500',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}