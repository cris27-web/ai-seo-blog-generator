<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en-GB',
  },
})
</script>

<template>
  <div>
    <a href="#main-content" class="skip-link">Skip to content</a>

    <SiteHeader />

    <div id="main-content" tabindex="-1">
      <NuxtPage />
    </div>

    <footer class="site-footer">
      <div class="site-container">
        <p>Company Insights</p>
        <p>
          Dataset-based articles, company rankings and funding insights.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site-footer {
  margin-top: 64px;
  padding-block: 28px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-muted);
  font-size: 0.9rem;
}

.site-footer p {
  margin-block: 4px;
}
</style>