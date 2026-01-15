import { Sparkles, CheckCircle2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="py-20 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group cursor-default">
          {/* Outer glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/50 rounded-full blur-2xl opacity-60 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Main icon container with 3D effect */}
          <div className="relative morph glass-strong neon-border p-8">
            <Sparkles className="h-16 w-16 text-gradient" style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} />
            <CheckCircle2 className="absolute -bottom-2 -right-2 h-6 w-6 text-primary drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]" />
          </div>
        </div>

        <div className="space-y-3 fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold gradient-text">
            No tasks yet
          </h3>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Add your first task above to get started and experience the magic
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex gap-2 justify-center fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="w-2 h-2 rounded-full bg-primary pulse-glow" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-accent pulse-glow" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-primary pulse-glow" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
