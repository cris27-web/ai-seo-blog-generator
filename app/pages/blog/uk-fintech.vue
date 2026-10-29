<script setup lang="ts">
import {
  parseCompanies,
  calculateStatistics,
} from '~~/shared/utils/companies'
import csv from '~/assets/data/fintech_companies_seed.csv?raw'


const { data: companies, error } = await useAsyncData(
  'fintech-companies',
  async () => parseCompanies(csv),
)

const statistics = computed(() =>
  calculateStatistics(companies.value ?? []),
)

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

useSeoMeta({
  title: 'Top 100 UK Fintech Companies by Fundraising | Company Insights',
  description:
    'Explore 100 UK fintech companies ranked by total fundraising, with company descriptions, regional data and funding statistics.',
})

</script>

<template>
  <main>
    <NuxtLink to="/">Back to home</NuxtLink>

    <h1>Top 100 UK Fintech Companies by Total Fundraising</h1>
    <p>Explore the companies and funding figures in the supplied dataset.</p>
    <p v-if="error" role="alert">
  We couldn't load the company dataset.
</p>
<p v-else>
  {{ companies?.length ?? 0 }} companies loaded.
</p>
<section v-if="companies?.length" aria-labelledby="statistics-heading">
  <h2 id="statistics-heading">Funding at a glance</h2>

  <dl>
    <dt>Companies in this dataset</dt>
    <dd>{{ statistics.companyCount }}</dd>

    <dt>Combined total fundraising</dt>
    <dd>{{ currencyFormatter.format(statistics.totalFunding) }}</dd>

    <dt>Average fundraising per company</dt>
    <dd>{{ currencyFormatter.format(statistics.averageFunding) }}</dd>
  </dl>

  <p>These figures describe the supplied dataset, rather than the entire UK fintech market.</p>
</section>
            <section v-if="companies?.length" aria-labelledby="rankings-heading">
  <h2 id="rankings-heading">Company rankings</h2>

  <div class="table-scroll">
    <table>
      <caption>
        UK fintech companies ranked by total fundraising in the supplied dataset
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
        <tr v-for="company in companies" :key="company.Rank">
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
  </main>
</template>
<style scoped>
main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

caption {
  text-align: left;
  margin-bottom: 12px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #d1d5db;
  text-align: left;
  vertical-align: top;
}

thead {
  background: #f3f4f6;
  color: #111827;
}
</style>