import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "6", 10)));

    const filter: Record<string, RegExp> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Job.countDocuments(search ? { $or: filter.$or } : {});
    const jobs = await Job.find(search ? { $or: filter.$or } : {})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const job = await Job.create({ ...body, postedBy: session.userId });
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
