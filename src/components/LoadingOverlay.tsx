export default function LoadingOverlay() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-2xl gradient-primary opacity-20 animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
            <span className="text-2xl">🪄</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">AI is designing your room...</p>
          <p className="text-sm text-muted-foreground">Analyzing mood, style, and budget</p>
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
