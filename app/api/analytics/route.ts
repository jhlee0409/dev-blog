import { getVisitorData } from "@/src/libs/analytics";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getVisitorData();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { today: "N/A", yesterday: "N/A", total: "N/A" },
      { status: 500 }
    );
  }
}
