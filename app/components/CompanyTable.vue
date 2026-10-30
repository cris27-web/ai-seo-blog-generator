<script setup lang="ts">
import type { CompanyRow } from '~~/shared/utils/companies'

defineProps<{
  companies: CompanyRow[]
}>()

const headingId = useId()
</script>

<template>
  <section :aria-labelledby="headingId">
    <h2 :id="headingId">Company rankings</h2>
    <p class="table-help">
  Scroll within the table to explore all companies and columns.
  Company names and column headings stay visible.
</p>

    <div
      class="table-scroll"
      role="region"
      :aria-labelledby="headingId"
      tabindex="0"
    >
      <table>
        <caption>
          Companies and rankings supplied in the dataset
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
          <tr v-for="(company, index) in companies" :key="index">
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
</template>

<style scoped>
section {
  margin-block: 32px;
}

h2 {
  line-height: 1.3;
}

.table-help {
  max-width: 70ch;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.table-scroll {
  max-height: 70vh;
  overflow: auto;
  isolation: isolate;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}

.table-scroll:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
}

table {
  width: 100%;
  min-width: 850px;
  border-collapse: separate;
  border-spacing: 0;
}

caption {
  padding: 12px;
  text-align: left;
  background: var(--color-surface);
  color: var(--color-muted);
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  vertical-align: top;
  background: var(--color-surface);
}

thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--color-soft);
}

tbody th[scope="row"] {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 150px;
  max-width: 190px;
  overflow-wrap: anywhere;
  border-right: 1px solid var(--color-border);
}

thead th:nth-child(2) {
  left: 0;
  z-index: 3;
  min-width: 150px;
  border-right: 1px solid var(--color-border);
}

tbody tr:hover > * {
  background: var(--color-soft);
}

td:last-child {
  min-width: 280px;
}

@media (max-width: 600px) {
  tbody th[scope="row"],
  thead th:nth-child(2) {
    min-width: 130px;
    max-width: 150px;
  }

  th,
  td {
    padding: 10px;
  }
}
</style>