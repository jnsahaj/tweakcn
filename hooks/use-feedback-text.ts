import { useEffect, useState } from "react";

const ROTATION_INTERVAL_IN_SECONDS = 8;

const DEFAULT_FEEDBACK_MESSAGES = ["Loading..."];

type UseFeedbackTextProps = {
  showFeedbackText: boolean;
  feedbackMessages: string[];
  rotationIntervalInSeconds?: number;
};

export function useFeedbackText({
  showFeedbackText,
  feedbackMessages = DEFAULT_FEEDBACK_MESSAGES,
  rotationIntervalInSeconds = ROTATION_INTERVAL_IN_SECONDS,
}: UseFeedbackTextProps) {
  const [elapsedTimeGenerating, setElapsedTimeGenerating] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showFeedbackText) {
      setElapsedTimeGenerating(0);

      interval = setInterval(() => {
        setElapsedTimeGenerating((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTimeGenerating(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showFeedbackText]);

  const stepsElapsed = Math.floor(elapsedTimeGenerating / rotationIntervalInSeconds);
  const feedbackIndex = stepsElapsed % feedbackMessages.length;
  const feedbackText = feedbackMessages[feedbackIndex];
  return feedbackText;
}
