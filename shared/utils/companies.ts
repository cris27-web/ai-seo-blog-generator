import Papa from 'papaparse'

export type CompanyRow = {
  Rank: string
  Company: string
  Region: string
  Stage: string
  Employees: string
  'Total Raised': string
  Description: string
  Website: string
  Industries: string
}
function normaliseHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

const headerAliases: Record<keyof CompanyRow, string[]> = {
  Rank: [
    'Ranking',
    'Position',
  ],
  Company: [
    'Company Name',
    'Business Name',
    'Organisation',
    'Organization',
    'Organisation Name',
    'Organization Name',
  ],
  Region: [
    'Location',
    'Headquarters',
    'HQ Location',
  ],
  Stage: [
    'Funding Stage',
    'Investment Stage',
    'Company Stage',
  ],
  Employees: [
    'Employee Count',
    'Number of Employees',
    'Headcount',
    'Team Size',
  ],
  'Total Raised': [
    'Total Funding',
    'Total Funding GBP',
    'Total Raised GBP',
    'Funding Raised',
    'Amount Raised',
    'Total Fundraising',
  ],
  Description: [
    'Company Description',
    'Business Description',
    'Business Summary',
    'Summary',
    'Overview',
  ],
  Website: [
    'Website URL',
    'Company Website',
    'Web Address',
    'URL',
  ],
  Industries: [
    'Industry',
    'Sector',
    'Sectors',
  ],
}

function resolveHeader(header: string): string {
  const normalised = normaliseHeader(header)

  for (const [field, aliases] of Object.entries(headerAliases)) {
    const candidates = [field, ...aliases]

    if (
      candidates.some(
        (candidate) => normaliseHeader(candidate) === normalised,
      )
    ) {
      return field
    }
  }

  return header.trim()
}

function parseFunding(value: string, company: string): number {
  const cleaned = value.replace(/[£,\s]/g, '')

  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new Error(`Invalid funding amount for ${company}`)
  }

  const amount = Number(cleaned)

  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid funding amount for ${company}`)
  }

  return amount
}

export function parseCompanies(csv: string): CompanyRow[] {
  const result = Papa.parse<CompanyRow>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: resolveHeader,
  })

  if (result.errors.length > 0) {
    throw new Error('The company CSV could not be parsed.')
  }

  if (
  result.meta.renamedHeaders &&
  Object.keys(result.meta.renamedHeaders).length > 0
) {
  throw new Error(
    'Some CSV columns have duplicate or equivalent names. ' +
    'Keep only one column for each company field.',
  )
}

  const requiredColumns = [
    'Rank',
    'Company',
    'Region',
    'Stage',
    'Employees',
    'Total Raised',
    'Description',
    'Website',
    'Industries',
  ]

  const headers = result.meta.fields ?? []
  const missingColumns = requiredColumns.filter(
    (column) => !headers.includes(column),
  )

 if (missingColumns.length > 0) {
  throw new Error(
    `Could not identify these columns: ${missingColumns.join(', ')}. ` +
    'Use the example CSV or rename equivalent columns.',
  )
}

  if (result.data.length === 0) {
    throw new Error('The CSV must contain at least one company.')
  }

  for (const [index, company] of result.data.entries()) {
    if (!company.Company?.trim()) {
      throw new Error(`Missing company name on data row ${index + 1}`)
    }

    parseFunding(company['Total Raised'], company.Company)
  }

  return result.data
}

export function calculateStatistics(companies: CompanyRow[]) {
  const totalFunding = companies.reduce(
    (total, company) =>
      total + parseFunding(company['Total Raised'], company.Company),
    0,
  )

  return {
    companyCount: companies.length,
    totalFunding,
    averageFunding: companies.length
      ? totalFunding / companies.length
      : 0,
  }
}