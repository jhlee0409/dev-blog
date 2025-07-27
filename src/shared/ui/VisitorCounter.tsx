'use client';

import { useEffect, useState } from 'react';
import { Users, Eye, Calendar, TrendingUp } from 'lucide-react';

interface VisitorStats {
  total: number;
  today: number;
  yesterday: number;
  date: string;
}

interface VisitorCounterProps {
  className?: string;
  showIcons?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export default function VisitorCounter({ 
  className = '', 
  showIcons = true,
  variant = 'default' 
}: VisitorCounterProps) {
  const [stats, setStats] = useState<VisitorStats>({
    total: 0,
    today: 0,
    yesterday: 0,
    date: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const recordVisitAndGetStats = async () => {
      try {
        // 방문 기록
        await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 통계 조회
        const response = await fetch('/api/visitors');
        if (!response.ok) {
          throw new Error('Failed to fetch visitor stats');
        }

        const data: VisitorStats = await response.json();
        
        if (mounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load visitor stats:', err);
        if (mounted) {
          setError('방문자 수를 불러올 수 없습니다');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    recordVisitAndGetStats();

    return () => {
      mounted = false;
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 text-sm ${className}`}>
        {error}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 ${className}`}>
        {showIcons && <Users className="w-4 h-4" />}
        <span>총 {formatNumber(stats.total)}명</span>
        <span className="text-gray-400">|</span>
        <span>오늘 {stats.today}명</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {showIcons && <TrendingUp className="w-5 h-5" />}
          방문자 통계
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {showIcons && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">총 방문자</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatNumber(stats.total)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {showIcons && <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />}
              <span className="text-sm font-medium text-green-600 dark:text-green-400">오늘</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.today}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {showIcons && <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">어제</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.yesterday}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div className={`flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 ${className}`}>
      <div className="flex items-center gap-2">
        {showIcons && <Users className="w-4 h-4" />}
        <span>총 {formatNumber(stats.total)}명 방문</span>
      </div>
      
      <div className="flex items-center gap-2">
        {showIcons && <Eye className="w-4 h-4" />}
        <span>오늘 {stats.today}명</span>
      </div>
      
      <div className="flex items-center gap-2">
        {showIcons && <Calendar className="w-4 h-4" />}
        <span>어제 {stats.yesterday}명</span>
      </div>
    </div>
  );
}