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
</script>

<template>
  <main v-if="blog" class="site-container article-page">
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

      <FundingStatistics :statistics="blog.statistics" />

      <section
        v-for="(section, index) in blog.copy.sections"
        :key="index"
        :aria-labelledby="`insight-${index}`"
      >
        <h2 :id="`insight-${index}`">{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </section>

      <CompanyTable :companies="blog.companies" />

      <footer class="note">
        Article copy was generated with AI from the uploaded dataset.
        Statistics were calculated directly from the data.
      </footer>
    </article>
  </main>
</template>