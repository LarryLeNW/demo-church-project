export interface SM2Input {
  rating: number; // 0 to 5
  repetitionCount: number;
  easeFactor: number;
  intervalDays: number;
}

export interface SM2Output {
  repetitionCount: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: Date;
}

export function calculateSM2(input: SM2Input): SM2Output {
  const { rating, repetitionCount, easeFactor, intervalDays } = input;

  let newRepetition = repetitionCount;
  let newInterval = intervalDays;
  let newEaseFactor = easeFactor;

  // 1. Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor =
    easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  newEaseFactor = Math.round(newEaseFactor * 100) / 100;

  // 2. Update Repetition Count & Interval Days
  if (rating < 3) {
    // Quên / Cần ôn lại: reset repetition về 0 và ôn lại vào ngày mai
    newRepetition = 0;
    newInterval = 1;
  } else {
    if (newRepetition === 0) {
      newInterval = 1;
    } else if (newRepetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * newEaseFactor);
    }
    newRepetition += 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  nextReviewDate.setHours(23, 59, 59, 999);

  return {
    repetitionCount: newRepetition,
    easeFactor: newEaseFactor,
    intervalDays: newInterval,
    nextReviewDate,
  };
}
