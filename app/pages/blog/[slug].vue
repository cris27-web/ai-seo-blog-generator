<script setup lang="ts">
import type { SavedBlog } from '~~/shared/types/blog'
definePageMeta({
  key: (route) => route.path,
})

const route = useRoute()
const slug = String(route.params.slug)

const { data: blog, error } = await useFetch<SavedBlog>(
  `/api/blogs/${encodeURIComponent(slug)}`,
)

if (error.value || !blog.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 404,
    statusMessage:
      error.value?.statusCode === 404
        ? 'Blog not found.'
        : 'This blog could not be loaded.',
  })
}

useSeoMeta({
  title: () => blog.value?.copy.title ?? 'Company Insights',
  description: () => blog.value?.copy.metaDescription ?? '',
  ogTitle: () => blog.value?.copy.title ?? 'Company Insights',
  ogDescription: () => blog.value?.copy.metaDescription ?? '',
  ogType: 'article',
})

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
</script>

<template>
  <main v-if="blog">
    <nav aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true"> / </span>
      <span>{{ blog.topic }}</span>
    </nav>

    <article>
      <header>
        <p class="eyebrow">Company insights</p>
        <h1>{{ blog.copy.title }}</h1>
        <p class="introduction">{{ blog.copy.introduction }}</p>
      </header>

      <section aria-labelledby="statistics-heading">
        <h2 id="statistics-heading">The dataset at a glance</h2>

        <dl class="statistics">
          <div>
            <dt>Companies</dt>
            <dd>{{ blog.statistics.companyCount }}</dd>
          </div>

          <div>
            <dt>Total funding</dt>
            <dd>
              {{ currencyFormatter.format(blog.statistics.totalFunding) }}
            </dd>
          </div>

          <div>
            <dt>Average funding</dt>
            <dd>
              {{ currencyFormatter.format(blog.statistics.averageFunding) }}
            </dd>
          </div>
        </dl>

        <p class="note">
          Figures describe the uploaded dataset and may not represent
          the entire industry. Funding amounts are in GBP.
        </p>
      </section>

      <section
        v-for="(section, index) in blog.copy.sections"
        :key="index"
        :aria-labelledby="`insight-${index}`"
      >
        <h2 :id="`insight-${index}`">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </section>

      <section aria-labelledby="companies-heading">
        <h2 id="companies-heading">Company rankings</h2>

        <div
          class="table-scroll"
          role="region"
          aria-labelledby="companies-heading"
          tabindex="0"
        >
          <table>
            <caption>
              Companies and rankings supplied in the uploaded dataset
            </caption>

            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Company</th>
                <th scope="col">Region</th>
                <th scope="col">Total raised</th>
                <th scope="col">Description</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(company, index) in blog.companies"
                :key="index"
              >
                <td>{{ company.Rank }}</td>
                <th scope="row">{{ company.Company }}</th>
                <td>{{ company.Region }}</td>
                <td>{{ company['Total Raised'] }}</td>
                <td>{{ company.Description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="note">
        Article copy was generated with AI from the uploaded dataset.
        Statistics were calculated directly from the data.
      </footer>
    </article>
  </main>
</template>

<style scoped>
main {
  max-width: 1100px;
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
  max-width: 850px;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.15;
}

h2 {
  line-height: 1.3;
}

p {
  max-width: 80ch;
}

a {
  color: #1749a3;
}

.eyebrow {
  font-weight: 700;
  color: #1749a3;
}

.introduction {
  font-size: 1.125rem;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.statistics > div {
  padding: 20px;
  background: #f1f5f9;
  border-radius: 8px;
}

dt {
  font-weight: 600;
}

dd {
  margin: 8px 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.note {
  color: #475569;
  font-size: 0.9rem;
}

.table-scroll {
  overflow-x: auto;
}

.table-scroll:focus-visible {
  outline: 3px solid #1749a3;
  outline-offset: 4px;
}

table {
  width: 100%;
  min-width: 750px;
  border-collapse: collapse;
}

caption {
  text-align: left;
  margin-bottom: 12px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #cbd5e1;
  text-align: left;
  vertical-align: top;
}

thead {
  background: #f1f5f9;
}
</style>