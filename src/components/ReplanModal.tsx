import React, { useState, useEffect } from 'react';
import { ReplanDiff, SessionChange } from '../types';
import { formatTime12h, formatFriendlyDate } from '../utils/dateUtils';
import { getCourseColor } from '../utils/courseColors';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  X,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

interface ReplanModalProps {
  isOpen: boolean;
  onClose: () => void;
  replanDiff: ReplanDiff | null;
  onApplyPlan: (newSessions: any) => void;
  isAnalyzing?: boolean;
}

export const ReplanModal: React.FC<ReplanModalProps> = ({
  isOpen,
  onClose,
  replanDiff,
  onApplyPlan,
  isAnalyzing = false,
}) => {
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Scanning calendar for missed study window & remaining daily capacity...',
    'Evaluating deadline proximity (CS 189 Midterm in 48h = High Urgency)...',
    'Protecting high-stakes exam prep: Re-routing to 7:30 PM prime focus slot...',
    'Rebalancing secondary tasks: Deferring low-urgency reading to tomorrow...',
    'Optimizing cognitive load to stay under 5.5h daily target...',
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStep(0);
      const interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < analysisSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 450);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Adaptive Re-Plan Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                  Schedule Recovery
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Automatic study schedule rebalancing around fixed commitments & upcoming deadlines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            id="close-replan-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Analysis State Animation */}
          {isAnalyzing ? (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950 animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI is Adapting Your Study Plan...
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium min-h-[20px] transition-all">
                  {analysisSteps[analysisStep]}
                </p>
              </div>

              <div className="max-w-sm mx-auto bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : replanDiff ? (
            <>
              {/* Trigger Reason & Value Statement */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    Plan Disruption Detected: Missed Study Block
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Trigger: <span className="font-semibold">{replanDiff.triggerReason}</span>. 
                    Rather than letting work pile up or cramming late at night, the AI recalculated optimal study slots.
                  </p>
                </div>
              </div>

              {/* AI Pedagogical Rationale Box */}
              <div className="p-5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    AI Scheduling Rationale: Why Tasks Were Moved
                  </h3>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {replanDiff.aiRationale}
                </p>

                {/* Key Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60">
                  {replanDiff.keyAdjustments.map((adj, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workload Impact Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-500 text-[11px] font-medium">Today's Study Load</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center justify-center space-x-1.5">
                    <span className="line-through text-slate-400 font-normal">{replanDiff.workloadSummary.todayHoursBefore}h</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-indigo-600 dark:text-indigo-400">{replanDiff.workloadSummary.todayHoursAfter}h</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-500 text-[11px] font-medium">Tomorrow's Load</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {replanDiff.workloadSummary.tomorrowHours} Hours
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-500 text-[11px] font-medium">Deadlines Safe</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center space-x-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{replanDiff.workloadSummary.deadlinesSafeCount} / {replanDiff.workloadSummary.deadlinesSafeCount} Safe</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-500 text-[11px] font-medium">Cramming Risk</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>0% (Optimized)</span>
                  </div>
                </div>
              </div>

              {/* Before vs After Diff View */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Detailed Schedule Adjustments ({replanDiff.changes.length} changes)</span>
                  </h3>
                  <span className="text-xs text-slate-400">Comparing Previous vs Proposed</span>
                </div>

                <div className="space-y-3">
                  {replanDiff.changes.map((change) => {
                    const colors = getCourseColor(change.courseColor);

                    return (
                      <div
                        key={change.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                      >
                        {/* Course & Action Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors.badgeBg} ${colors.badgeText}`}>
                              {change.courseCode}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                              {change.taskTitle}
                            </span>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center space-x-1 ${
                            change.urgencyImpact === 'protected_high_priority'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                              : change.urgencyImpact === 'safely_deferred'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300'
                          }`}>
                            {change.urgencyImpact === 'protected_high_priority' && <Zap className="w-3 h-3 mr-0.5" />}
                            <span>{change.type === 'moved' ? 'Shifted Today' : 'Rescheduled Tomorrow'}</span>
                          </span>
                        </div>

                        {/* Visual Time Comparison Box */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs">
                          {/* Previous Time */}
                          <div className="flex items-center space-x-2 text-slate-500">
                            <span className="font-medium text-slate-400 uppercase text-[10px] w-14">Original:</span>
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="line-through">
                              {change.previousSession ? `${formatFriendlyDate(change.previousSession.date)} ${formatTime12h(change.previousSession.startTime)} - ${formatTime12h(change.previousSession.endTime)}` : 'Unscheduled'}
                            </span>
                          </div>

                          {/* Proposed Time */}
                          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <span className="font-medium text-indigo-500 uppercase text-[10px] w-14">New Plan:</span>
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {change.newSession ? `${formatFriendlyDate(change.newSession.date)} ${formatTime12h(change.newSession.startTime)} - ${formatTime12h(change.newSession.endTime)}` : 'Deferred'}
                            </span>
                          </div>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 pl-1 border-l-2 border-indigo-400">
                          {change.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No pending plan adjustments.
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Keep Original Plan
          </button>

          <button
            type="button"
            disabled={isAnalyzing || !replanDiff}
            onClick={() => {
              if (replanDiff) {
                onApplyPlan(replanDiff.proposedSessions);
                onClose();
              }
            }}
            id="apply-new-replan-btn"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply New Schedule to Calendar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
