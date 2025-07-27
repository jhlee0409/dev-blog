import { Redis } from '@upstash/redis';
import { mockRedis } from './redis-mock';

// Redis 클라이언트 생성 (개발 환경에서는 mock 사용)
const isProduction = process.env.NODE_ENV === 'production' && 
                   process.env.UPSTASH_REDIS_REST_URL && 
                   process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = isProduction 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : mockRedis as any; // 개발 환경에서 mock 사용

// Redis 키 생성 함수
export const keys = {
  // 전체 방문자 수
  totalVisitors: 'visitors:total',
  
  // 일별 방문자 수 (YYYY-MM-DD 형식)
  dailyVisitors: (date: string) => `visitors:daily:${date}`,
  
  // IP별 방문 기록 (중복 방지용)
  userVisit: (ip: string, date: string) => `visit:${ip}:${date}`,
};

// 날짜 포맷 함수 (KST 기준)
export function getKSTDate(date: Date = new Date()): string {
  const kstOffset = 9 * 60; // KST는 UTC+9
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const kstTime = new Date(utc + (kstOffset * 60000));
  
  return kstTime.toISOString().split('T')[0]; // YYYY-MM-DD
}

// 어제 날짜 구하기
export function getYesterday(): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return getKSTDate(yesterday);
}

// IP 해싱 함수 (프라이버시 보호)
export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.HASH_SALT || 'default-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}