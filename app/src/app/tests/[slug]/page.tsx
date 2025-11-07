import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import {
  getMockTestBySlug,
  mockTests,
} from "@/data/mockTests";
import { TestRunner } from "@/components/TestRunner";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return mockTests.map((test) => ({ slug: test.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const test = getMockTestBySlug(params.slug);
  if (!test) {
    return {
      title: "Mock Test Not Found | TezPrep",
      description: "The requested test could not be located.",
    };
  }

  return {
    title: `${test.title} | TezPrep`,
    description: test.description,
  };
}

export default function TestPage({ params }: { params: Params }) {
  const test = getMockTestBySlug(params.slug);

  if (!test) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link href="/">Dashboard</Link>
        <span>›</span>
        <Link href="/tests">Mock Tests</Link>
        <span>›</span>
        <span>{test.title}</span>
      </nav>
      <TestRunner test={test} />
    </div>
  );
}
