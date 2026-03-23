import { useState, useEffect } from "react";
import { Camera, Palette, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  length: number;
  width: number;
  budget: number;
  mood: string;
  style: string;
  area: number;
}

export default function AILoader({ length, width, budget, mood, style, area }: Props) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: <Camera className="w-8 h-8 text-primary" />,
      text: "Analyzing your room...",
      subtext: `Scanning ${area || length * width} sq ft space`
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      text: "Applying style...",
      subtext: `Applying ${mood} mood with ${style} aesthetics`
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      text: "Almost done...",
      subtext: `Optimizing for ₹${budget.toLocaleString("en-IN")} budget`
    }
  ];

  useEffect(() => {
    const totalTime = 2500;
    const intervalTime = 50; 
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setProgress(Math.min(100, (elapsed / totalTime) * 100));

      if (elapsed < 1000) setStep(0);
      else if (elapsed < 2000) setStep(1);
      else setStep(2);

      if (elapsed >= totalTime) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-border">
        <div className="p-8 pb-10 flex flex-col items-center text-center relative h-[220px] justify-center">
          {steps.map((s, index) => (
            <div 
              key={index}
              className={`absolute flex flex-col items-center transition-all duration-500 ${
                step === index ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 relative">
                {s.icon}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1.5">{s.text}</h3>
              <p className="text-sm text-muted-foreground font-medium">{s.subtext}</p>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8 pt-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#C4622D] rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
