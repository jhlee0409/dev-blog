// 로컬 개발용 Mock Redis 클라이언트
export class MockRedis {
  private storage = new Map<string, any>();
  private expirations = new Map<string, number>();

  async get(key: string) {
    this.cleanExpired();
    return this.storage.get(key) || null;
  }

  async incr(key: string) {
    this.cleanExpired();
    const current = Number(this.storage.get(key)) || 0;
    const newValue = current + 1;
    this.storage.set(key, newValue);
    return newValue;
  }

  async setex(key: string, seconds: number, value: any) {
    this.storage.set(key, value);
    this.expirations.set(key, Date.now() + (seconds * 1000));
    return 'OK';
  }

  pipeline() {
    const commands: Array<() => Promise<any>> = [];
    
    return {
      incr: (key: string) => {
        commands.push(() => this.incr(key));
        return this;
      },
      setex: (key: string, seconds: number, value: any) => {
        commands.push(() => this.setex(key, seconds, value));
        return this;
      },
      exec: async () => {
        const results: any[] = [];
        for (const cmd of commands) {
          results.push(await cmd());
        }
        return results;
      }
    };
  }

  private cleanExpired() {
    const now = Date.now();
    const toDelete: string[] = [];
    
    this.expirations.forEach((expireTime, key) => {
      if (now > expireTime) {
        toDelete.push(key);
      }
    });
    
    toDelete.forEach(key => {
      this.storage.delete(key);
      this.expirations.delete(key);
    });
  }
}

// 개발 환경에서 mock 데이터 초기화
const mockRedis = new MockRedis();

// 초기 데이터 설정 (데모용)
if (typeof window === 'undefined') {
  mockRedis.incr('visitors:total').then(() => {
    // 총 방문자를 1000명으로 설정
    for (let i = 0; i < 999; i++) {
      mockRedis.incr('visitors:total');
    }
  });
  
  // 어제 방문자 설정
  mockRedis.incr('visitors:daily:2025-07-27').then(() => {
    for (let i = 0; i < 49; i++) {
      mockRedis.incr('visitors:daily:2025-07-27');
    }
  });
  
  // 오늘 방문자 설정
  mockRedis.incr('visitors:daily:2025-07-28').then(() => {
    for (let i = 0; i < 9; i++) {
      mockRedis.incr('visitors:daily:2025-07-28');
    }
  });
}

export { mockRedis };