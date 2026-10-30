<template>
  <header class="site-header">
    <div class="site-container header-content">
      <NuxtLink to="/" class="brand">
        <span class="brand-mark" aria-hidden="true">CI</span>
        <span>Company Insights</span>
      </NuxtLink>

      <nav aria-label="Main navigation">
        <NuxtLink to="/" class="nav-link" exact-active-class="is-current">
          Home
        </NuxtLink>

        <NuxtLink
          to="/blog/uk-fintech"
          class="nav-link"
          exact-active-class="is-current"
        >
          Fintech example
        </NuxtLink>

        <NuxtLink to="/upload" class="button button-primary">
          Generate article
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px 24px;
  padding-block: 20px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 750;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  font-size: 0.85rem;
}

nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-muted);
  font-weight: 600;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.is-current {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

@media (max-width: 600px) {
  nav {
    width: 100%;
  }
}
</style>