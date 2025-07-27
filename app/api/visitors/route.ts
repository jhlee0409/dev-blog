import { NextRequest, NextResponse } from 'next/server';
import { redis, keys, getKSTDate, getYesterday, hashIP } from '@/src/libs/redis';

export const runtime = 'edge';

// 방문자 수 기록
export async function POST(request: NextRequest) {
  try {
    // IP 주소 추출
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIP || 'unknown';
    
    const today = getKSTDate();
    const hashedIP = await hashIP(ip);
    
    // 오늘 이미 방문한 IP인지 확인 (24시간 중복 방지)
    const visitKey = keys.userVisit(hashedIP, today);
    const hasVisited = await redis.get(visitKey);
    
    if (hasVisited) {
      // 이미 방문한 사용자는 카운트하지 않음
      return NextResponse.json({ 
        success: true, 
        message: 'Already counted today',
        newVisit: false 
      });
    }
    
    // Redis 파이프라인으로 원자적 연산 수행
    const pipeline = redis.pipeline();
    
    // 1. 총 방문자 수 증가
    pipeline.incr(keys.totalVisitors);
    
    // 2. 오늘 방문자 수 증가
    pipeline.incr(keys.dailyVisitors(today));
    
    // 3. IP 방문 기록 (24시간 만료)
    pipeline.setex(visitKey, 86400, '1'); // 24시간 = 86400초
    
    await pipeline.exec();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Visit recorded',
      newVisit: true 
    });
    
  } catch (error) {
    console.error('Failed to record visit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}

// 방문자 수 조회
export async function GET() {
  try {
    const today = getKSTDate();
    const yesterday = getYesterday();
    
    // Redis에서 모든 데이터를 병렬로 가져오기
    const [totalVisitors, todayVisitors, yesterdayVisitors] = await Promise.all([
      redis.get(keys.totalVisitors),
      redis.get(keys.dailyVisitors(today)),
      redis.get(keys.dailyVisitors(yesterday)),
    ]);
    
    return NextResponse.json({
      total: Number(totalVisitors) || 0,
      today: Number(todayVisitors) || 0,
      yesterday: Number(yesterdayVisitors) || 0,
      date: today,
    });
    
  } catch (error) {
    console.error('Failed to get visitor stats:', error);
    return NextResponse.json(
      { 
        total: 0, 
        today: 0, 
        yesterday: 0,
        error: 'Failed to get visitor stats' 
      },
      { status: 500 }
    );
  }
}