<script setup lang="ts">
useSeoMeta({
  title: 'Company Insights | Dataset-Based Industry Articles',
  description:
    'Explore company rankings, funding statistics and industry insights, or generate an article from your own company dataset.',
})

const { data: blogs, error } = await useFetch('/api/blogs')
</script>

<template>
  <main>
    <header>
      <h1>Company Insights</h1>
      <p>
        Explore company rankings and funding insights,
        or turn a company dataset into a new article.
      </p>

      <NuxtLink to="/upload">Generate a blog from a CSV</NuxtLink>
    </header>

    <section aria-labelledby="featured-heading">
      <h2 id="featured-heading">Featured dataset</h2>

      <NuxtLink to="/blog/uk-fintech">
        Top 100 UK fintech companies by fundraising
      </NuxtLink>
    </section>

    <section aria-labelledby="articles-heading">
      <h2 id="articles-heading">Generated articles</h2>

      <p v-if="error" role="alert">
        We couldn't load the article list. Please try again later.
      </p>

      <ul v-else-if="blogs?.length" class="articles">
        <li v-for="blog in blogs" :key="blog.slug">
          <article>
            <h3>
              <NuxtLink :to="`/blog/${blog.slug}`">
                {{ blog.title }}
              </NuxtLink>
            </h3>

            <p>{{ blog.description }}</p>
            <p class="note">
              {{ blog.companyCount }} companies in this dataset
            </p>
          </article>
        </li>
      </ul>

      <p v-else>
        No articles have been generated yet.
        <NuxtLink to="/upload">Create the first one.</NuxtLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
  line-height: 1.7;
  color: #172033;
}

header,
section {
  margin-block: 32px;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
}

a {
  color: #1749a3;
}

.articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
  padding: 0;
  list-style: none;
}

.articles article {
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
}

.note {
  color: #475569;
  font-size: 0.9rem;
}
</style>