export default function BlogIndexPage() {
  return (
    <article className="blog-article blog-coming-soon">
      <p className="eyebrow">Blog</p>
      <h1 className="blog-title">A proper engineering blog is dropping soon.</h1>
      <div className="blog-meta">
        <span>No posts live yet</span>
        <span>Backend systems + full-stack notes next</span>
      </div>
      <p className="blog-body">
        I&apos;m keeping the old placeholder posts off the site for now. The blog I&apos;m dropping next will be more
        honest to how I actually work: backend-heavy product engineering, infra decisions, AI tooling, data flows, and
        the full-stack judgment behind reliable software.
      </p>

      <div className="blog-soon-panel" aria-label="Upcoming blog topics">
        <div>
          <span className="blog-soon-label">01</span>
          <p>Backend systems, APIs, databases, queues, and the ugly parts that make products dependable.</p>
        </div>
        <div>
          <span className="blog-soon-label">02</span>
          <p>Full-stack shipping notes from real product work, rollout safety, and production debugging.</p>
        </div>
        <div>
          <span className="blog-soon-label">03</span>
          <p>AI workflows and tooling with enough engineering depth to survive beyond a shiny demo.</p>
        </div>
      </div>
    </article>
  );
}
