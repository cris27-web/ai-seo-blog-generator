<script setup lang="ts">
useSeoMeta({
  title: 'Company Insights | Dataset-Based Industry Articles',
  description:
    'Explore company rankings, funding statistics and industry insights, or generate an article from your own company dataset.',
})

const { data: blogs, error } = await useFetch('/api/blogs')
</script>

<template>
  <main class="site-container homepage">
    <header class="hero">
      <p class="eyebrow">Company data, explained</p>

      <h1>Explore the companies behind the numbers.</h1>

      <p class="hero-description">
        Discover company rankings and funding insights, or turn your
        own dataset into an article with calculated statistics and
        AI-generated commentary.
      </p>

      <div class="hero-actions">
        <NuxtLink to="/upload" class="button button-primary">
          Generate an article
        </NuxtLink>

        <NuxtLink to="/blog/uk-fintech" class="button button-secondary">
          Explore the fintech example
        </NuxtLink>
      </div>

      <p class="hero-note">
        Upload a compatible CSV. Generate copy. Explore the results.
      </p>
    </header>

    <section class="featured" aria-labelledby="featured-heading">
      <div class="featured-copy">
        <p class="eyebrow">Featured analysis</p>
        <h2 id="featured-heading">
          A closer look at UK fintech fundraising
        </h2>

        <p>
          Explore 100 companies from the supplied dataset, with funding
          totals, regional insights and a complete company ranking.
        </p>

        <NuxtLink to="/blog/uk-fintech" class="featured-link">
          Read the fintech analysis
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <div class="featured-detail">
        <span class="dataset-label">UK fintech dataset</span>
        <strong>100</strong>
        <span>companies to explore</span>
        <span class="dataset-note">
          Compare funding, location and business activities.
        </span>
      </div>
    </section>

    <section class="article-section" aria-labelledby="articles-heading">
      <div class="section-heading">
        <div>
          <p class="eyebrow">From the datasets</p>
          <h2 id="articles-heading">Generated articles</h2>
        </div>

        <NuxtLink to="/upload">Create an article</NuxtLink>
      </div>

      <p v-if="error" role="alert" class="message">
        We couldn't load the article list. Please refresh to try again.
      </p>

      <ul v-else-if="blogs?.length" class="articles">
        <li v-for="blog in blogs" :key="blog.slug">
          <article class="article-card">
            <p class="card-label">Dataset analysis</p>

            <h3>
              <NuxtLink :to="`/blog/${blog.slug}`">
                {{ blog.title }}
              </NuxtLink>
            </h3>

            <p class="card-description">{{ blog.description }}</p>

            <p class="card-meta">
              {{ blog.companyCount }} companies in this dataset
            </p>
          </article>
        </li>
      </ul>

      <div v-else class="message">
        <h3>Your first article starts with a dataset.</h3>
        <p>
          Upload a compatible company CSV to generate an article
          with funding statistics and a rankings table.
        </p>
        <NuxtLink to="/upload" class="button button-primary">
          Upload a dataset
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.homepage {
  padding-block: 56px 16px;
}

.hero {
  max-width: 850px;
  padding-block: 24px 64px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  max-width: 800px;
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.hero-description {
  max-width: 65ch;
  margin-block: 24px;
  color: var(--color-muted);
  font-size: 1.15rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-note {
  margin-top: 20px;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.featured {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.featured-copy {
  padding: clamp(24px, 4vw, 40px);
}

h2 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.featured-copy > p:not(.eyebrow) {
  max-width: 60ch;
  color: var(--color-muted);
}

.featured-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  font-weight: 700;
}

.featured-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
  background: var(--color-soft);
}

.dataset-label {
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--color-primary);
}

.featured-detail strong {
  margin-top: 12px;
  font-size: 4.5rem;
  line-height: 1.1;
  letter-spacing: -0.05em;
}

.dataset-note {
  max-width: 30ch;
  margin-top: 20px;
  font-size: 0.9rem;
  color: var(--color-muted);
}

.article-section {
  margin-top: 64px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 28px;
}

.section-heading > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-weight: 650;
}

.articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.card-label {
  margin: 0 0 16px;
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 650;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.35;
}

h3 a {
  color: var(--color-text);
  text-decoration: none;
}

h3 a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.card-description {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.card-meta {
  margin-top: auto;
  margin-bottom: 0;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.85rem;
}

.message {
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

@media (max-width: 700px) {
  .homepage {
    padding-top: 24px;
  }

  .hero {
    padding-bottom: 40px;
  }

  .featured {
    grid-template-columns: 1fr;
  }

  .article-section {
    margin-top: 40px;
  }
}
</style>