import Link from "next/link";
import styles from "./page.module.css";
import { mockTests } from "@/data/mockTests";
import { TestCatalog } from "@/components/TestCatalog";

const featureHighlights = [
  {
    title: "Smart bilingual interface",
    description:
      "English-first UI with Hinglish question support, ideal for Tier-I and NTPC aspirants.",
    icon: "🌐",
  },
  {
    title: "Real exam timer",
    description:
      "Adaptive timer with auto-submit and attempt palette keeps you aligned with exam pressure.",
    icon: "⏱️",
  },
  {
    title: "Deep explanations",
    description:
      "Every answer comes with a quick revision note so you understand the 'why' instantly.",
    icon: "🧠",
  },
];

const faqs = [
  {
    question: "SSC aur Railway ke liye kaun kaun se mock tests milenge?",
    answer:
      "TezPrep mein abhi SSC CGL Quant Essentials, Railway NTPC General Awareness aur Railway Group D Reasoning jaise targeted practice sets included hain. Har week naye subject wise sets add kiye jaate hain.",
  },
  {
    question: "Timer khatam hone par kya hota hai?",
    answer:
      "Timer zero par aate hi test automatically submit ho jaata hai. Aap turant scorecard, accuracy metrics aur question wise analysis dekh sakte hain.",
  },
  {
    question: "Negative marking kaise handle hoti hai?",
    answer:
      "Har mock test ke marking scheme mein negative marking defined hai. Result calculate karte waqt correct aur incorrect attempts ke hisaab se score update hota hai.",
  },
  {
    question: "Mobile devices par ye test run hoga?",
    answer:
      "Haan, pura interface mobile-friendly aur lightweight hai. Aap kisi bhi browser se bina install kiye attempt kar sakte hain.",
  },
];

export default function Home() {
  const totalTests = mockTests.length;
  const totalQuestions = mockTests.reduce(
    (sum, test) => sum + test.questions.length,
    0
  );
  const totalMinutes = mockTests.reduce(
    (sum, test) => sum + test.durationMinutes,
    0
  );
  const sscCount = mockTests.filter((test) => test.category === "ssc").length;
  const railwayCount = mockTests.filter(
    (test) => test.category === "railway"
  ).length;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className="accent-chip">Railway + SSC Pro Prep</span>
        <h1>
          SSC & Railway mock tests that feel like the real challenge.
        </h1>
        <p>
          Focused practice drills with smart analytics, bilingual prompts, and
          exam-accurate timers. Crack speed, accuracy, aur confidence – sab ek
          hi jagah.
        </p>
        <div className={styles.heroActions}>
          <Link href="/tests" className="btn-primary">
            Start practising now
          </Link>
          <a href="#features" className="btn-secondary">
            Explore features
          </a>
        </div>
        <div className={styles.heroMetrics}>
          <article>
            <strong>{totalTests}</strong>
            <span>Total mock tests</span>
          </article>
          <article>
            <strong>{totalQuestions}+</strong>
            <span>Concept-check questions</span>
          </article>
          <article>
            <strong>{totalMinutes} mins</strong>
            <span>Practice time covered</span>
          </article>
          <article>
            <strong>
              {sscCount} SSC · {railwayCount} Railway
            </strong>
            <span>Exam-focused sets</span>
          </article>
        </div>
      </section>

      <section className={styles.featureStrip} id="features">
        {featureHighlights.map((feature) => (
          <div key={feature.title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className="badge">Mock Test Library</span>
            <h2>Pick a test, beat the clock, repeat.</h2>
          </div>
          <p>
            Handpicked question sets based on recent SSC CGL, CHSL, NTPC and
            Group D trends. Filter by exam aur search topics to jump straight to
            problem areas.
          </p>
        </div>
        <TestCatalog tests={mockTests} />
      </section>

      <section className={styles.faqSection} id="faqs">
        <div className={styles.sectionHeading}>
          <div>
            <span className="badge">FAQs</span>
            <h2>Sabse zyada pooche jaane wale sawal</h2>
          </div>
          <p>
            Attempt se pehle agar koi doubt ho toh yahan se clear kar lo. Aur
            bhi help chahiye? Reach out via support@tezprep.in.
          </p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((faq) => (
            <article key={faq.question} className={styles.faqCard}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
