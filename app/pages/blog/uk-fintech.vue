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

const insights = computed(() => {
  const rows = companies.value ?? []
  const topTen = calculateStatistics(rows.slice(0, 10))

  return {
    londonCount: rows.filter(
      (company) => company.Region.trim() === 'London',
    ).length,
    topTenFunding: topTen.totalFunding,
    topTenShare: statistics.value.totalFunding
      ? (topTen.totalFunding / statistics.value.totalFunding) * 100
      : 0,
  }
})

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

    <article>
      <header>
        <h1>Top 100 UK Fintech Companies by Total Fundraising</h1>

        <p>
          Explore the supplied ranking of 100 UK fintech companies,
          including their fundraising totals, regional locations and
          business activities. The table lets you compare individual
          companies, while the analysis highlights patterns within
          this dataset.
        </p>
      </header>

      <p v-if="error" role="alert">
        We couldn't load the company dataset.
      </p>

      <template v-else-if="companies?.length">
        <FundingStatistics :statistics="statistics" />

        <section aria-labelledby="funding-heading">
          <h2 id="funding-heading">Funding concentration in the ranking</h2>

          <p>
            The first ten companies in the supplied ranking have raised
            {{ currencyFormatter.format(insights.topTenFunding) }}
            combined. That represents
            {{ insights.topTenShare.toFixed(1) }}% of the total funding
            recorded across all {{ statistics.companyCount }} companies.
          </p>

          <p>
            This concentration provides context for the average funding
            figure: the average does not mean that each company has
            raised a similar amount.
          </p>
        </section>

        <section aria-labelledby="regions-heading">
          <h2 id="regions-heading">Where these fintech companies are based</h2>

          <p>
            London accounts for {{ insights.londonCount }} of the
            {{ statistics.companyCount }} companies in this dataset.
            Other represented regions include the North West,
            South West and East of England.
          </p>

          <p>
            This describes the regional distribution of the supplied
            companies, rather than the distribution of every fintech
            business in the UK.
          </p>
        </section>

        <section aria-labelledby="activities-heading">
          <h2 id="activities-heading">Business activities represented</h2>

          <p>
            The company descriptions cover different financial
            technology applications. Nevis develops an AI platform
            for wealth management. Januus.io develops a database
            linking cryptocurrency wallets with identity information.
            Adfin develops a platform aimed at reducing the
            administration involved in invoicing and payments.
          </p>
        </section>

        <CompanyTable :companies="companies" />

        <section aria-labelledby="methodology-heading">
          <h2 id="methodology-heading">About this dataset</h2>

          <p>
            Rankings, locations, descriptions and fundraising amounts
            come from the supplied CSV. Totals, averages and funding
            shares are calculated from those records. The dataset
            does not provide a historical comparison, so this article
            does not infer growth or changes over time.
          </p>
        </section>
      </template>
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

h1 {
  max-width: 850px;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.15;
}

p {
  max-width: 80ch;
}

a {
  color: #1749a3;
}

header,
section {
  margin-block: 32px;
}

h2 {
  line-height: 1.3;
}
</style>