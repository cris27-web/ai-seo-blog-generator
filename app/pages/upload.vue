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
  <main>
    <NuxtLink to="/">Back to home</NuxtLink>

    <h1>Generate a company insights blog</h1>
    <p>
      Upload a company dataset to create an article with AI-written
      insights, calculated statistics and a company rankings table.
    </p>

    <form :aria-busy="busy" @submit.prevent="generate">
      <fieldset :disabled="busy">
        <legend>Dataset details</legend>

        <label for="topic">Industry or topic</label>
        <input
          id="topic"
          v-model="topic"
          type="text"
          placeholder="For example, UK healthtech companies"
          maxlength="100"
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
          Required columns: Rank, Company, Region, Stage, Employees,
          Total Raised, Description, Website and Industries.
          Funding must use GBP amounts.
        </p>

        <p class="help">
          Uploaded data is sent to Google Gemini to generate copy.
          The resulting article and company table will be publicly
          accessible. Use data you have permission to publish.
        </p>

        <button type="submit">
          {{ busy ? 'Generating article…' : 'Generate article' }}
        </button>
      </fieldset>
    </form>

    <p role="status">
      {{ busy ? 'Generating and saving your article. Please wait.' : '' }}
    </p>

    <p v-if="errorMessage" role="alert" class="error">
      {{ errorMessage }}
    </p>
  </main>
</template>

<style scoped>
main {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #172033;
}

fieldset {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

legend,
label {
  font-weight: 600;
}

label {
  display: block;
  margin-top: 20px;
}

input {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  font: inherit;
}

button {
  margin-top: 16px;
  padding: 12px 20px;
  border: 0;
  border-radius: 6px;
  background: #1749a3;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.help {
  font-size: 0.9rem;
  color: #475569;
}

.error {
  color: #b91c1c;
}

a {
  color: #1749a3;
}
</style>