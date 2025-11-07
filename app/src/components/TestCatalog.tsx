'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./TestCatalog.module.css";
import cardStyles from "./TestCard.module.css";
import type { MockTest, TestCategory } from "@/data/mockTests";

type FilterValue = "all" | TestCategory;

const filterOptions: { label: string; value: FilterValue }[] = [
  { label: "All exams", value: "all" },
  { label: "SSC focus", value: "ssc" },
  { label: "Railway focus", value: "railway" },
];

type TestCatalogProps = {
  tests: MockTest[];
};

const getDifficultySplit = (test: MockTest) => {
  return test.questions.reduce(
    (acc, question) => {
      acc[question.difficulty] += 1;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );
};

const formatCategoryLabel = (category: TestCategory) =>
  category === "ssc" ? "SSC" : "Railway";

const formatNegativeMarking = (value: number) =>
  value === 0 ? "No negative" : `${value}`;

const TestCard = ({ test }: { test: MockTest }) => {
  const topics = useMemo(
    () => Array.from(new Set(test.questions.map((q) => q.topic))).slice(0, 3),
    [test.questions]
  );
  const difficultySplit = getDifficultySplit(test);
  const total = test.questions.length;
  const maxScore = total * test.marking.correct;

  return (
    <article className={`${cardStyles.card} card-surface`}>
      <div className={cardStyles.header}>
        <span
          className={`${cardStyles.category} ${
            test.category === "ssc" ? cardStyles.ssc : cardStyles.railway
          }`}
        >
          {formatCategoryLabel(test.category)}
        </span>
        <span className={cardStyles.duration}>{test.durationMinutes} mins</span>
      </div>
      <h3>{test.title}</h3>
      <p>{test.description}</p>

      <ul className={cardStyles.meta}>
        <li>
          <strong>{total}</strong>
          <span>Questions</span>
        </li>
        <li>
          <strong>{maxScore}</strong>
          <span>Total marks</span>
        </li>
        <li>
          <strong>{formatNegativeMarking(test.marking.incorrect)}</strong>
          <span>Negative</span>
        </li>
      </ul>

      <div className={cardStyles.difficultyBar} aria-hidden="true">
        {(["easy", "medium", "hard"] as const).map((level) => {
          const count = difficultySplit[level];
          const width = total === 0 ? 0 : Math.max((count / total) * 100, 4);
          return (
            <div
              key={level}
              className={`${cardStyles.difficultySegment} ${cardStyles[level]}`}
              style={{ width: `${width}%` }}
            >
              <span>{count}</span>
            </div>
          );
        })}
      </div>
      <div className={cardStyles.difficultyLabels}>
        <span>Easy</span>
        <span>Medium</span>
        <span>Hard</span>
      </div>

      <div className={cardStyles.topicList}>
        {topics.map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>

      <div className={cardStyles.footer}>
        <Link href={`/tests/${test.slug}`} className={cardStyles.cta}>
          Attempt mock test
        </Link>
        <div className={cardStyles.instructionsPreview}>
          <strong>Key rule:</strong>{" "}
          <span>{test.instructions[0] ?? "Read the onscreen instructions."}</span>
        </div>
      </div>
    </article>
  );
};

export function TestCatalog({ tests }: TestCatalogProps) {
  const [category, setCategory] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");

  const filteredTests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesCategory =
        category === "all" ? true : test.category === category;
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        test.title.toLowerCase().includes(term) ||
        test.description.toLowerCase().includes(term) ||
        test.questions.some((question) =>
          question.topic.toLowerCase().includes(term)
        )
      );
    });
  }, [tests, category, search]);

  return (
    <div className={styles.catalog}>
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.filterButton} ${
                category === option.value ? styles.filterActive : ""
              }`}
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <input
            type="search"
            placeholder="Search by topic, title, or keyword"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search mock tests"
          />
        </div>
      </div>

      <div className={styles.resultMeta}>
        <span>
          Showing {filteredTests.length} of {tests.length} tests
        </span>
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className={styles.clearSearch}
          >
            Clear search
          </button>
        )}
      </div>

      {filteredTests.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No mock tests found</h3>
          <p>
            Try removing filters ya alag keyword search karke dekho. Hum naye
            tests regularly add karte rehte hain.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredTests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      )}
    </div>
  );
}
