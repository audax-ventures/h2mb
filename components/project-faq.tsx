import Link from 'next/link';

const questions = [
  {question: 'What is H2MB working to develop?', answer: 'H2MB is working toward green hydrogen production in Manitoba and collaborating with local industries to explore hydrogen adoption. The goal is to help build both the supply and the market for green hydrogen in the Prairie region.'},
  {question: 'Is hydrogen available to purchase today?', answer: 'H2MB’s public information describes a project in development. Supply availability, specifications, delivery arrangements, and timing need to be discussed directly with the team. This website does not offer an online purchase or confirm current production.'},
  {question: 'Who should get in touch?', answer: 'We welcome conversations with potential hydrogen users, fleet operators, industrial businesses, technology providers, and organizations interested in project partnerships.'},
  {question: 'What information helps start a supply discussion?', answer: 'Your application, operating location, approximate demand, fuel specifications if known, and anticipated timing are useful starting points. You do not need to have every detail worked out before getting in touch.'},
];

export function ProjectFAQ() {
  return <section className="container section faq-section" aria-labelledby="faq-title">
    <div><span className="eyebrow">A clearer picture</span><h2 id="faq-title">Questions?<br />Start here.</h2><p>For details specific to your organization, <Link href="/contact">talk with the H2MB team ↗</Link>.</p></div>
    <div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
  </section>;
}
