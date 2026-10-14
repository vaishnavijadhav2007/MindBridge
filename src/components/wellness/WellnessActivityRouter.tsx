import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { WellnessActivity, ActivityFeedback } from '../../types/wellness';
import { BreathingActivityModal } from './BreathingActivityModal';
import { GroundingActivityModal } from './GroundingActivityModal';
import { JournalingActivityModal } from './JournalingActivityModal';
import { FocusTimerModal } from './FocusTimerModal';
import { GratitudeModal } from './GratitudeModal';
import { SimpleActivityModal } from './SimpleActivityModal';
import { ActivityFeedbackModal } from './ActivityFeedbackModal';

/**
 * WellnessActivityRouter
 * Renders the correct interactive modal for whichever WellnessActivity
 * is currently active in context. After completion, shows the feedback modal.
 * Drop this once anywhere in the app tree — it self-manages.
 */
export const WellnessActivityRouter: React.FC = () => {
  const { activeWellnessActivity, closeWellnessActivity, completeWellnessActivity, recordFeedback } = useWellness();

  const [pendingFeedback, setPendingFeedback] = useState<WellnessActivity | null>(null);

  const handleComplete = (activity: WellnessActivity) => {
    completeWellnessActivity(activity.id);
    setPendingFeedback(activity);
  };

  const handleFeedback = (feedback: ActivityFeedback) => {
    if (pendingFeedback) {
      recordFeedback(pendingFeedback.id, feedback);
    }
    setPendingFeedback(null);
  };

  const handleFeedbackClose = () => setPendingFeedback(null);

  const act = activeWellnessActivity;
  const isOpen = !!act;

  return (
    <>
      {/* Breathing */}
      <BreathingActivityModal
        isOpen={isOpen && act?.activityType === 'breathing'}
        onClose={closeWellnessActivity}
        onComplete={() => act && handleComplete(act)}
      />

      {/* Grounding */}
      <GroundingActivityModal
        isOpen={isOpen && act?.activityType === 'grounding'}
        onClose={closeWellnessActivity}
        onComplete={() => act && handleComplete(act)}
      />

      {/* Journaling */}
      <JournalingActivityModal
        isOpen={isOpen && act?.activityType === 'journaling'}
        onClose={closeWellnessActivity}
        onComplete={() => act && handleComplete(act)}
      />

      {/* Focus Timer */}
      <FocusTimerModal
        isOpen={isOpen && act?.activityType === 'focus-timer'}
        onClose={closeWellnessActivity}
        onComplete={() => act && handleComplete(act)}
      />

      {/* Gratitude */}
      <GratitudeModal
        isOpen={isOpen && act?.activityType === 'gratitude'}
        onClose={closeWellnessActivity}
        onComplete={() => act && handleComplete(act)}
      />

      {/* Simple step-by-step */}
      {act && act.activityType === 'simple' && (
        <SimpleActivityModal
          isOpen={isOpen && act?.activityType === 'simple'}
          onClose={closeWellnessActivity}
          onComplete={() => handleComplete(act)}
          activity={act}
        />
      )}

      {/* Post-activity feedback */}
      {pendingFeedback && (
        <ActivityFeedbackModal
          isOpen={!!pendingFeedback}
          activityTitle={pendingFeedback.title}
          completionPrompt={pendingFeedback.completionPrompt ?? 'Well done for taking time for yourself today.'}
          onFeedback={handleFeedback}
          onClose={handleFeedbackClose}
        />
      )}
    </>
  );
};
