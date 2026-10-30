<script setup lang="ts">
useSeoMeta({
  title: 'Generate a Company Insights Blog',
  description: 'Upload a company CSV to generate a dataset-based article.',
})

const topic = ref('')
const file = shallowRef<File | null>(null)
const busy = ref(false)
const errorMessage = ref('')

function selectFile(event: Event) {
  const input = event.target as HTMLInputElement

  file.value = input.files?.[0] ?? null
  errorMessage.value = ''
}

async function generate() {
  if (busy.value) return

  errorMessage.value = ''

  const selectedFile = file.value
  const selectedTopic = topic.value.trim()

  if (!selectedTopic || !selectedFile) {
    errorMessage.value = 'Enter a topic and select a CSV file.'
    return
  }

  if (selectedFile.size > 1_000_000) {
    errorMessage.value = 'The CSV must be smaller than 1 MB.'
    return
  }

  busy.value = true

  try {
    const csv = await selectedFile.text()

    const result = await $fetch<{ slug: string; url: string }>(
      '/api/blogs/generate',
      {
        method: 'POST',
        body: {
          topic: selectedTopic,
          csv,
        },
        timeout: 90_000,
        retry: 0,
      },
    )

    await navigateTo(`/blog/${encodeURIComponent(result.slug)}`)
  } catch (error: unknown) {
    const failure = error as {
      data?: {
        statusMessage?: string
        data?: { reason?: string }
      }
    }

    errorMessage.value =
      failure.data?.data?.reason ??
      failure.data?.statusMessage ??
      'The blog could not be generated. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="site-container upload-page">
    <header class="page-heading">
      <p class="eyebrow">Create from your data</p>
      <h1>Turn a company dataset into an article.</h1>
      <p class="introduction">
        Choose a topic and upload your CSV. We’ll calculate the funding
        statistics, generate article copy and create a page you can share.
      </p>
    </header>

    <div class="upload-layout">
      <div class="form-panel">
        <form :aria-busy="busy" @submit.prevent="generate">
          <fieldset :disabled="busy">
            <legend>Dataset details</legend>

            <label for="topic">Industry or topic</label>
            <p id="topic-help" class="help">
              Give the article a clear focus, such as UK healthtech companies.
            </p>
            <input
              id="topic"
              v-model="topic"
              type="text"
              placeholder="UK healthtech companies"
              maxlength="100"
              aria-describedby="topic-help"
              required
            >

            <label for="csv">Company dataset</label>
            <input
              id="csv"
              type="file"
              accept=".csv,text/csv"
              aria-describedby="csv-help"
              required
              @change="selectFile"
            >

            <p id="csv-help" class="help">
              CSV only, under 1 MB, with up to 1,000 companies.
              Funding amounts must be in GBP.
            </p>

            <p v-if="file" class="selected-file">
              Selected: {{ file.name }}
            </p>

            <div class="publication-note">
              <strong>Before you generate</strong>
              <p>
                Your dataset is sent to Google Gemini. The resulting
                article and company table will be publicly accessible.
                Use data you have permission to publish.
              </p>
            </div>

            <button type="submit" class="button button-primary">
              {{ busy ? 'Generating article…' : 'Generate article' }}
            </button>
          </fieldset>
        </form>

        <p role="status" class="status">
          {{ busy ? 'Generating and saving your article. Please keep this page open.' : '' }}
        </p>

        <p v-if="errorMessage" role="alert" class="error">
          {{ errorMessage }}
        </p>
      </div>

      <aside class="guidance" aria-labelledby="guidance-heading">
        <h2 id="guidance-heading">Prepare your dataset</h2>
        <p>Your CSV needs these column names:</p>

        <ul class="column-list">
          <li>Rank</li>
          <li>Company</li>
          <li>Region</li>
          <li>Stage</li>
          <li>Employees</li>
          <li>Total Raised</li>
          <li>Description</li>
          <li>Website</li>
          <li>Industries</li>
        </ul>

        <p>
          Quote values containing commas, such as
          <code>"£3,000,000"</code>.
        </p>

        <a href="/fintech_companies_seed.csv" download>
          Download the example CSV
        </a>

        <div class="guidance-divider">
          <h3>What happens next?</h3>
          <ol>
            <li>We validate your company data.</li>
            <li>Statistics are calculated from the CSV.</li>
            <li>AI generates the article copy.</li>
            <li>Your saved article opens automatically.</li>
          </ol>
        </div>

        <p class="help">
          AI-generated copy can contain mistakes. Review the article
          before using it elsewhere.
        </p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.upload-page {
  padding-block: 56px 16px;
}

.page-heading {
  max-width: 760px;
  margin-bottom: 36px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.introduction {
  margin-top: 20px;
  color: var(--color-muted);
  font-size: 1.1rem;
}

.upload-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}

.form-panel,
.guidance {
  min-width: 0;
  padding: clamp(20px, 3vw, 32px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  padding: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

label {
  display: block;
  margin-top: 24px;
  font-weight: 650;
}

input {
  display: block;
  width: 100%;
  min-width: 0;
  margin-top: 8px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--color-surface);
  color: var(--color-text);
}

input::placeholder {
  color: var(--color-muted);
}

input[type="file"] {
  padding: 16px;
  border-style: dashed;
  background: var(--color-background);
}

input::file-selector-button {
  margin-right: 12px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-primary);
  font: inherit;
  cursor: pointer;
}

.help {
  margin-block: 8px;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.selected-file {
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.publication-note {
  margin-block: 24px;
  padding: 16px;
  border-radius: var(--radius-control);
  background: var(--color-soft);
  font-size: 0.9rem;
}

.publication-note p {
  margin: 6px 0 0;
}

button {
  width: 100%;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.status {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.status:not(:empty) {
  margin-top: 16px;
}

.error {
  margin-bottom: 0;
  padding: 12px;
  border: 1px solid currentColor;
  border-radius: var(--radius-control);
  color: #b91c1c;
}

.guidance {
  background: var(--color-soft);
}

.guidance h2 {
  margin-top: 0;
  font-size: 1.25rem;
  line-height: 1.3;
}

.guidance h3 {
  font-size: 1rem;
}

.column-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.column-list li {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  font-size: 0.85rem;
}

.guidance-divider {
  margin-top: 28px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

ol {
  padding-left: 20px;
}

li + li {
  margin-top: 4px;
}

.column-list li {
  margin-top: 0;
}

@media (max-width: 800px) {
  .upload-page {
    padding-top: 28px;
  }

  .upload-layout {
    grid-template-columns: 1fr;
  }
}
</style>