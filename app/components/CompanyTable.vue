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