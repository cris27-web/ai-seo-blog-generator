<script setup lang="ts">
import type { SavedBlog } from '~~/shared/types/blog'

defineProps<{
  statistics: SavedBlog['statistics']
}>()

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
</script>

<template>
  <section>
    <h2>The dataset at a glance</h2>

    <dl class="statistics">
      <div>
        <dt>Companies</dt>
        <dd>{{ statistics.companyCount }}</dd>
      </div>

      <div>
        <dt>Total funding</dt>
        <dd>
          {{ currencyFormatter.format(statistics.totalFunding) }}
        </dd>
      </div>

      <div>
        <dt>Average funding per company</dt>
        <dd>
          {{ currencyFormatter.format(statistics.averageFunding) }}
        </dd>
      </div>
    </dl>

    <p class="note">
      Figures describe the supplied dataset and may not represent
      the entire industry. Funding amounts are in GBP.
    </p>
  </section>
</template>

<style scoped>
section {
  margin-block: 32px;
}

h2 {
  line-height: 1.3;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
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
  max-width: 80ch;
  color: #475569;
  font-size: 0.9rem;
}
</style>