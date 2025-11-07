'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import cn from "clsx";
import styles from "./TestRunner.module.css";
import type { MockTest, Question } from "@/data/mockTests";

type Stage = "intro" | "active" | "review";

type TestResult = {
  score: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
  timeTaken: number;
  forced: boolean;
};

type NavigatorStatus = "current" | "attempted" | "marked" | "pending";

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.abs(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};

const getOptionLabel = (question: Question, optionId?: string) =>
  question.options.find((option) => option.id === optionId)?.label;

const getNavigatorStatus = (
  index: number,
  current: number,
  questionId: string,
  answers: Record<string, string | undefined>,
  marked: Record<string, boolean>
): NavigatorStatus => {
  if (index === current) return "current";
  if (marked[questionId]) return "marked";
  if (answers[questionId]) return "attempted";
  return "pending";
};

export function TestRunner({ test }: { test: MockTest }) {
  const totalQuestions = test.questions.length;
  const totalSeconds = test.durationMinutes * 60;

  const [stage, setStage] = useState<Stage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>(
    {}
  );
  const [markedMap, setMarkedMap] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [result, setResult] = useState<TestResult | null>(null);

  const attemptedCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const progress = totalQuestions
    ? Math.round((attemptedCount / totalQuestions) * 100)
    : 0;

  const topicBreakdown = useMemo(() => {
    const group = new Map<string, number>();
    test.questions.forEach((question) => {
      group.set(question.topic, (group.get(question.topic) ?? 0) + 1);
    });
    return Array.from(group.entries()).sort((a, b) => b[1] - a[1]);
  }, [test.questions]);

  const startTest = () => {
    setStage("active");
    setCurrentIndex(0);
    setAnswers({});
    setMarkedMap({});
    setTimeLeft(totalSeconds);
    setResult(null);
  };

  const toggleMarkQuestion = (questionId: string) => {
    setMarkedMap((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const submitTest = useCallback(
    (forced = false) => {
      if (stage === "review") return;

      const summary = test.questions.reduce(
        (acc, question) => {
          const userAnswer = answers[question.id];
          if (!userAnswer) {
            acc.unanswered += 1;
          } else if (userAnswer === question.answer) {
            acc.correct += 1;
          } else {
            acc.incorrect += 1;
          }
          return acc;
        },
        { correct: 0, incorrect: 0, unanswered: 0 }
      );

      const score =
        summary.correct * test.marking.correct +
        summary.incorrect * test.marking.incorrect +
        summary.unanswered * test.marking.unanswered;

      const attempted = summary.correct + summary.incorrect;
      const accuracy =
        attempted === 0 ? 0 : (summary.correct / attempted) * 100;

      setResult({
        score,
        correct: summary.correct,
        incorrect: summary.incorrect,
        unanswered: summary.unanswered,
        accuracy,
        timeTaken: totalSeconds - Math.max(timeLeft, 0),
        forced,
      });
      setStage("review");
    },
    [answers, stage, test.marking.correct, test.marking.incorrect, test.marking.unanswered, test.questions, timeLeft, totalSeconds]
  );

  useEffect(() => {
    if (stage !== "active") return;
    if (timeLeft <= 0) {
      const timeout = window.setTimeout(() => submitTest(true), 0);
      return () => window.clearTimeout(timeout);
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage, timeLeft, submitTest]);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= totalQuestions ? prev : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? prev : prev - 1));
  };

  const handleRetake = () => {
    setStage("intro");
    setAnswers({});
    setMarkedMap({});
    setResult(null);
    setTimeLeft(totalSeconds);
    setCurrentIndex(0);
  };

  const currentQuestion = test.questions[currentIndex];
  const maxScore = totalQuestions * test.marking.correct;

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {stage === "intro" && (
        <section className={`${styles.introCard} card-surface`}>
          <div className={styles.introHeader}>
            <span className={styles.categoryBadge}>
              {test.category === "ssc" ? "SSC" : "Railway"} Mock Test
            </span>
            <h1>{test.title}</h1>
            <p>{test.description}</p>
          </div>

          <div className={styles.introStats}>
            <article>
              <strong>{totalQuestions}</strong>
              <span>Total questions</span>
            </article>
            <article>
              <strong>{test.durationMinutes} mins</strong>
              <span>Timer duration</span>
            </article>
            <article>
              <strong>{maxScore}</strong>
              <span>Maximum marks</span>
            </article>
            <article>
              <strong>
                +{test.marking.correct} / {test.marking.incorrect}
              </strong>
              <span>Correct / Negative</span>
            </article>
          </div>

          <div className={styles.introGrid}>
            <div>
              <h2>Instructions</h2>
              <ul>
                {test.instructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Topic blueprint</h2>
              <ul className={styles.topicList}>
                {topicBreakdown.map(([topic, count]) => (
                  <li key={topic}>
                    <span>{topic}</span>
                    <span>{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.introActions}>
            <button className="btn-primary" type="button" onClick={startTest}>
              Start test
            </button>
            <div className={styles.timerInfo}>
              <span>Timer starts immediately. You can navigate freely.</span>
            </div>
          </div>
        </section>
      )}

      {stage === "active" && (
        <section className={`${styles.testSurface} card-surface`}>
          <header className={styles.testHeader}>
            <div className={styles.timerBlock}>
              <span>Time left</span>
              <strong
                className={cn({
                  [styles.timerWarning]: timeLeft <= 60,
                })}
              >
                {formatSeconds(timeLeft)}
              </strong>
            </div>
            <div className={styles.progressBlock}>
              <span>
                Attempted {attemptedCount}/{totalQuestions}
              </span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressValue}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className={styles.actionsBlock}>
              <button
                className={styles.submitButton}
                type="button"
                onClick={() => submitTest(false)}
              >
                Submit test
              </button>
            </div>
          </header>

          <div className={styles.body}>
            <aside className={styles.navigator}>
              <h3>Question palette</h3>
              <div className={styles.navigatorGrid}>
                {test.questions.map((question, index) => {
                  const status = getNavigatorStatus(
                    index,
                    currentIndex,
                    question.id,
                    answers,
                    markedMap
                  );
                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={cn(styles.navigatorItem, styles[status])}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Question ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className={styles.paletteLegend}>
                <span>
                  <span className={styles.legendCurrent} />
                  Current
                </span>
                <span>
                  <span className={styles.legendAttempted} />
                  Attempted
                </span>
                <span>
                  <span className={styles.legendMarked} />
                  Marked
                </span>
              </div>
            </aside>

            <article className={styles.questionArea}>
              <header>
                <span>{`Question ${currentIndex + 1} of ${totalQuestions}`}</span>
                <button
                  type="button"
                  className={cn(styles.markButton, {
                    [styles.marked]: markedMap[currentQuestion.id],
                  })}
                  onClick={() => toggleMarkQuestion(currentQuestion.id)}
                >
                  {markedMap[currentQuestion.id] ? "Marked for review" : "Mark for review"}
                </button>
              </header>

              <h2>{currentQuestion.prompt}</h2>

              <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(styles.option, {
                        [styles.selectedOption]: isSelected,
                      })}
                      onClick={() =>
                        selectOption(currentQuestion.id, option.id)
                      }
                    >
                      <span className={styles.optionPrefix}>{option.id.toUpperCase()}.</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.questionFooter}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={handleNext}
                  disabled={currentIndex === totalQuestions - 1}
                >
                  Next
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {stage === "review" && result && (
        <section className={`${styles.reviewSurface} card-surface`}>
          <header className={styles.reviewHeader}>
            <div>
              <span className="badge">
                {result.forced ? "Auto submitted" : "Submitted"}
              </span>
              <h1>Scorecard</h1>
              <p>
                Overall score {result.score.toFixed(2)} / {maxScore}. Accuracy{" "}
                {result.accuracy.toFixed(1)}%. Time taken{" "}
                {formatSeconds(result.timeTaken)}.
              </p>
            </div>
            <div className={styles.reviewActions}>
              <button className="btn-primary" type="button" onClick={handleRetake}>
                Retake test
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={startTest}
              >
                Attempt again
              </button>
            </div>
          </header>

          <div className={styles.reviewStats}>
            <article>
              <strong>{result.correct}</strong>
              <span>Correct</span>
            </article>
            <article>
              <strong>{result.incorrect}</strong>
              <span>Incorrect</span>
            </article>
            <article>
              <strong>{result.unanswered}</strong>
              <span>Unanswered</span>
            </article>
            <article>
              <strong>{attemptedCount}</strong>
              <span>Total attempted</span>
            </article>
          </div>

          <div className={styles.reviewTable}>
            {test.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.answer;
              const correctAnswer = getOptionLabel(question, question.answer);
              const userLabel = getOptionLabel(question, userAnswer);

              return (
                <article
                  key={question.id}
                  className={cn(styles.reviewItem, {
                    [styles.reviewCorrect]: isCorrect,
                    [styles.reviewIncorrect]:
                      userAnswer && userAnswer !== question.answer,
                    [styles.reviewSkipped]: !userAnswer,
                  })}
                >
                  <header>
                    <span>Q{index + 1}</span>
                    <span>{question.topic}</span>
                    <span className={styles.difficultyTag}>
                      {question.difficulty}
                    </span>
                  </header>
                  <p className={styles.reviewPrompt}>{question.prompt}</p>
                  <div className={styles.reviewAnswers}>
                    <div>
                      <strong>Your answer:</strong>{" "}
                      <span>{userLabel ?? "Not attempted"}</span>
                    </div>
                    <div>
                      <strong>Correct answer:</strong>{" "}
                      <span>{correctAnswer}</span>
                    </div>
                  </div>
                  <p className={styles.reviewExplanation}>
                    {question.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
