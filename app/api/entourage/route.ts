import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import {
  asSheetRows,
  fetchGoogleScriptJson,
  invalidateSheetsCache,
  listResponseHeaders,
  postGoogleScriptJson,
  SHEETS_CACHE_KEYS,
  withSheetsCache,
} from "@/lib/sheets-cache"

// Replace this with your Entourage Google Apps Script URL
const ENTOURAGE_SCRIPT_URL = siteConfig.googleAPI.entourage
const GOOGLE_SHEET_URL = siteConfig.googleAPI.googleShare

// Entourage interface
export interface Entourage {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

type GvizCell = { v?: unknown } | null
type GvizResponse = {
  table?: {
    cols?: Array<{ label?: string }>
    rows?: Array<{ c?: GvizCell[] }>
  }
}

function text(value: unknown) {
  return value == null ? "" : String(value).trim()
}

function isEntourageRow(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const row = value as Record<string, unknown>
  return Boolean(
    text(row.Name ?? row.name ?? row.newName) &&
      text(row.RoleCategory ?? row.roleCategory),
  )
}

function googleSheetId(url: string) {
  return url.match(/\/spreadsheets\/d\/([^/]+)/)?.[1] ?? ""
}

async function fetchEntourageSheetRows(): Promise<Entourage[]> {
  const sheetId = googleSheetId(GOOGLE_SHEET_URL)
  if (!sheetId) throw new Error("Invalid Google Sheet URL")

  const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`)
  url.searchParams.set("tqx", "out:json")
  url.searchParams.set("headers", "1")
  url.searchParams.set("sheet", "Entourage")

  const response = await fetch(url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) {
    throw new Error(`Google Sheet request failed (${response.status})`)
  }

  const body = await response.text()
  const openingParen = body.indexOf("(")
  const closingParen = body.lastIndexOf(")")
  if (openingParen < 0 || closingParen <= openingParen) {
    throw new Error("Invalid Google Sheet response")
  }

  const payload = JSON.parse(body.slice(openingParen + 1, closingParen)) as GvizResponse
  const columns = payload.table?.cols ?? []
  const rows = payload.table?.rows ?? []
  const columnIndex = new Map(
    columns.map((column, index) => [text(column.label).toLowerCase(), index]),
  )
  const indexOf = (...labels: string[]) => {
    for (const label of labels) {
      const index = columnIndex.get(label.toLowerCase())
      if (index !== undefined) return index
    }
    return -1
  }
  const nameIndex = indexOf("Name", "newName")
  const categoryIndex = indexOf("RoleCategory")
  const titleIndex = indexOf("RoleTitle")
  const emailIndex = indexOf("Email")
  if (nameIndex < 0 || categoryIndex < 0) {
    throw new Error("Entourage sheet columns are missing")
  }

  const cellValue = (cells: GvizCell[], index: number) =>
    index < 0 ? "" : text(cells[index]?.v)

  return rows.flatMap((row) => {
    const cells = row.c ?? []
    const member: Entourage = {
      Name: cellValue(cells, nameIndex),
      RoleCategory: cellValue(cells, categoryIndex),
      RoleTitle: cellValue(cells, titleIndex),
      Email: cellValue(cells, emailIndex),
    }
    return member.Name && member.RoleCategory ? [member] : []
  })
}

async function fetchEntourageRows() {
  let scriptError: unknown

  try {
    const payload = await fetchGoogleScriptJson(ENTOURAGE_SCRIPT_URL)
    const rows = asSheetRows(payload)
    if (rows?.some(isEntourageRow)) return rows
    scriptError = new Error("Entourage Apps Script returned a different sheet")
  } catch (error) {
    scriptError = error
  }

  try {
    return await fetchEntourageSheetRows()
  } catch (sheetError) {
    console.error("Entourage Google Sheet fallback failed:", sheetError)
    throw scriptError instanceof Error ? scriptError : sheetError
  }
}

// GET: Fetch all entourage
export async function GET() {
  try {
    const data = await withSheetsCache(SHEETS_CACHE_KEYS.entourage, async () => {
      return fetchEntourageRows()
    })

    return NextResponse.json(data, { status: 200, headers: listResponseHeaders })
  } catch (error) {
    console.error('Error fetching entourage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entourage' },
      { status: 500 }
    )
  }
}

// POST: Add a new entourage member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, RoleCategory, RoleTitle, Email } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const entourageData: Record<string, string> = {
      Name: Name.trim(),
      RoleCategory: RoleCategory?.trim() || '',
      Email: Email?.trim() || '',
    }
    if (RoleTitle?.trim()) {
      entourageData.RoleTitle = RoleTitle.trim()
    }

    const data = await postGoogleScriptJson(ENTOURAGE_SCRIPT_URL, entourageData)
    invalidateSheetsCache(SHEETS_CACHE_KEYS.entourage)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error adding entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to add entourage member' },
      { status: 500 }
    )
  }
}

// PUT: Update an existing entourage member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name, RoleCategory, RoleTitle, Email, originalName } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const updateData = {
      action: 'update',
      originalName: originalName || Name, // Use originalName for lookup, Name for update
      Name: Name.trim(),
      RoleCategory: RoleCategory?.trim() || '',
      RoleTitle: RoleTitle?.trim() || '',
      Email: Email?.trim() || '',
    }

    const data = await postGoogleScriptJson(ENTOURAGE_SCRIPT_URL, updateData)
    invalidateSheetsCache(SHEETS_CACHE_KEYS.entourage)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to update entourage member' },
      { status: 500 }
    )
  }
}

// DELETE: Delete an entourage member
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { Name } = body

    // Validation
    if (!Name || typeof Name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const deleteData = {
      action: 'delete',
      Name: Name.trim(),
    }

    const data = await postGoogleScriptJson(ENTOURAGE_SCRIPT_URL, deleteData)
    invalidateSheetsCache(SHEETS_CACHE_KEYS.entourage)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error deleting entourage member:', error)
    return NextResponse.json(
      { error: 'Failed to delete entourage member' },
      { status: 500 }
    )
  }
}
