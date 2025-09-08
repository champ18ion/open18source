import { CheckCircle } from "lucide-react";

// Create a new component for the health analysis
export default function ContributionHealth({ health }) {
  if (!health) return null;
  const { responsiveness, onboarding } = health;

  return (
    <>
      <h2 className="section-title mt-8">Contribution Health</h2>
      <div className="card p-6 space-y-4">
        {/* Responsiveness */}
        <div className="flex items-start gap-3">
          <span className={`mt-1 ${responsiveness.score >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>
            <CheckCircle size={18} />
          </span>
          <div>
            <h4 className="font-clash">Responsiveness Score: {responsiveness.score}/10</h4>
            <p className="text-sm text-muted-foreground">{responsiveness.message}</p>
          </div>
        </div>
        {/* Onboarding */}
        <div className="flex items-start gap-3">
          <span className={`mt-1 ${onboarding.score >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>
            <CheckCircle size={18} />
          </span>
          <div>
            <h4 className="font-clash">Onboarding Score: {onboarding.score}/10</h4>
            <p className="text-sm text-muted-foreground">{onboarding.message}</p>
          </div>
        </div>
      </div>
    </>
  );
}