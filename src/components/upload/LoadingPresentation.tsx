import { Loader2 } from 'lucide-react';

interface LoadingPresentationProps {
  stage: string;
}

export const LoadingPresentation = ({ stage }: LoadingPresentationProps) => {
  return (
    <div className="w-full max-w-md mx-auto text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Preparing your presentation</h2>
      <p className="text-slate-500">{stage}</p>
      
      <div className="mt-8 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className="bg-blue-600 h-2 rounded-full w-full animate-[pulse_1.5s_ease-in-out_infinite] origin-left"></div>
      </div>
    </div>
  );
};
