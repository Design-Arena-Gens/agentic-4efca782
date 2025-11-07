import Link from "next/link";
import styles from "./page.module.css";
import { mockTests } from "@/data/mockTests";
import { TestCatalog } from "@/components/TestCatalog";

export const metadata = {
  title: "All Mock Tests | TezPrep",
  description:
    "Attempt SSC and Railway mock tests with instant analytics, timers, and bilingual support.",
};

export default function TestsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className="accent-chip">Mock Test Library</span>
        <h1>Ready-to-attempt SSC & Railway mock tests.</h1>
        <p>
          Pick your exam, hit the timer, aur ek hi dashboard mein accuracy,
          speed aur topic wise breakdown pao. Har set latest pattern ko dhyan
          mein rakh ke design kiya gaya hai.
        </p>
        <div className={styles.heroActions}>
          <Link href="/" className="btn-secondary">
            Go to dashboard
          </Link>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <TestCatalog tests={mockTests} />
      </section>
    </div>
  );
}
