# AI-Powered SEO Blog Generator

A Nuxt application that turns a company CSV into a saved,
server-rendered article with AI-generated copy, calculated funding
statistics and a company rankings table.

## Live application

https://ai-seo-blog-generator.netlify.app

## Features

- A UK fintech page using the supplied 100-company dataset.
- CSV upload with a user-supplied industry or topic.
- Server-side CSV validation using Papa Parse.
- Funding totals and averages calculated in code.
- Structured article generation using Google Gemini.
- Persistent article storage using Netlify Blobs.
- Reusable blog pages with article-specific SEO metadata.
- Homepage links to generated articles.
- Responsive tables, labelled inputs and status/error messages.

## Technology

- Nuxt 4, Vue 3 and TypeScript
- Papa Parse
- Google Gemini API: gemini-3.1-flash-lite
- Netlify hosting and Blobs storage
- @netlify/nuxt for local storage emulation

## Run locally

Use Node.js 22.12 or later. Node.js 22 is configured for deployment.

```bash
npm ci
```

Create a `.env` file in the repository root:

```dotenv
NUXT_GEMINI_API_KEY=your_gemini_api_key
```

Obtain a key through Google AI Studio. Do not commit it.

```bash
npm run dev
```

Open http://localhost:3000.

Local storage is separate from production storage. Articles generated
locally are not automatically uploaded to the deployed site.

## Generate an article

1. Open `/upload`.
2. Enter a descriptive topic, such as "UK fintech companies".
3. Select a compatible CSV.
4. Select "Generate article".
5. The application saves the result and opens its blog URL.

The supplied example CSV is available at
`public/fintech_companies_seed.csv`.

Uploads must be under 1 MB and contain no more than 1,000 companies.

Required column names:

```text
Rank,Company,Region,Stage,Employees,Total Raised,Description,Website,Industries
```

Funding values must be GBP amounts, for example `£30,314,247`.
Values containing commas must be quoted according to CSV conventions.

The application uses the supplied ranks and row order; it does not
independently verify the rankings.

Uploaded data is sent to Google Gemini. Generated articles and company
tables are publicly accessible. Use data you have permission to publish.

## Architecture

```text
CSV and topic
    → server-side validation
    → calculated statistics
    → Gemini structured copy generation
    → Netlify Blobs storage
    → /blog/[slug]
```

- `shared/utils/companies.ts`: CSV parsing, validation and statistics.
- `shared/types/blog.ts`: shared article types.
- `server/utils/generateBlogCopy.ts`: prompt, API call and output validation.
- `server/utils/blogStorage.ts`: saving, retrieval and article summaries.
- `server/api/blogs/generate.post.ts`: generation endpoint.
- `server/api/blogs/[slug].get.ts`: article retrieval endpoint.
- `server/api/blogs/index.get.ts`: article list endpoint.
- `app/pages/upload.vue`: upload interface.
- `app/pages/blog/[slug].vue`: reusable article template.
- `app/pages/blog/uk-fintech.vue`: supplied fintech dataset page.

Statistics are calculated directly from the CSV rather than delegated
to the language model. AI-generated text is rendered as text rather
than injected as HTML.

## Production build and deployment

```bash
npm run build
```

The repository is connected to Netlify. Pushes to `main` trigger a build.

Netlify settings:

- Base directory: repository root
- Build command: `npm run build`
- Publish directory: `dist`
- `NODE_VERSION`: `22`
- `NUXT_GEMINI_API_KEY`: configured privately in Netlify

Nuxt's Nitro engine generates the Netlify server implementation.
The application requires server functionality; it is not a static-only
export.

The Gemini key must be available to the deployed server functions.
Environment variable changes require a new deployment.

## Validation performed

- Production build completed locally.
- CSV-to-article generation tested locally and on the deployed site.
- Saved articles retrieved through the API.
- Generated pages checked for server-rendered content and 100 table rows.
- Article titles, meta descriptions and funding totals checked.
- Homepage checked for links to saved production articles.

These checks do not constitute a full automated test suite or a
complete accessibility audit.

## Limitations and future improvements

- Gemini can return inaccurate or unsupported prose despite prompt
  constraints and structural validation. Editorial review is needed.
- Free-tier quotas and provider availability can interrupt generation.
- Uploads require the supplied column format and GBP funding values.
- Generation is public, without authentication or application-level
  rate limiting.
- A repeated submission may create another article.
- Listing articles reads all stored documents; a larger system would
  need pagination and a summary index or database.
- Publication is immediate; there is no draft/review workflow.
- Further SEO work includes a sitemap, canonical URLs and structured data.
- Further reliability work includes automated tests, idempotency,
  background jobs and clearer provider error handling.

## AI assistance

AI assistance was used for implementation guidance, code examples,
debugging and discussion of alternatives. Generated code was reviewed
and exercised through local and deployed checks.

The accompanying technical reflection describes the development
process and remaining limitations.
