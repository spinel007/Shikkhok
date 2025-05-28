import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get("file") as unknown as File

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 })
  }

  // Update the file size limit to 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File size too large (max 10MB)" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = file.name

  // Save the file to the public directory
  const filePath = path.join(process.cwd(), "public", filename)
  await writeFile(filePath, buffer)

  console.log(`saved at ${filePath}`)

  return NextResponse.json({ filename }, { status: 200 })
}
