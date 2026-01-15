import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading todos">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className={cn(
            'card-3d border-border bg-card relative overflow-hidden',
            `stagger-${Math.min(index + 1, 5)}`
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 animate-pulse" />
          <div className="p-4 flex items-center gap-4 relative z-10">
            {/* Checkbox placeholder with glow */}
            <div className="glow-effect relative">
              <Skeleton className="h-5 w-5 rounded-lg shimmer shrink-0 pulse-glow" />
            </div>

            {/* Description placeholder */}
            <Skeleton className="h-4 flex-1 rounded-lg shimmer max-w-xs" />
            <Skeleton className="h-4 w-20 rounded-lg shimmer hidden sm:block" />

            {/* Action buttons placeholder */}
            <div className="flex gap-1 opacity-50">
              <Skeleton className="h-8 w-8 rounded-lg shimmer btn-3d" />
              <Skeleton className="h-8 w-8 rounded-lg shimmer btn-3d" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper function for className
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
