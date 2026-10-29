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
    transformHeader: (header) => header.trim(),
  })

  if (result.errors.length > 0) {
    throw new Error('The company CSV could not be parsed.')
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
    throw new Error(`Missing columns: ${missingColumns.join(', ')}`)
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