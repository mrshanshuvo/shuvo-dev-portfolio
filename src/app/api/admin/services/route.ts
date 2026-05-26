import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await Service.findById(id);
      if (!item)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    }

    const data = await Service.find().sort({ order: 1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    // Get last order
    const lastItem = await Service.findOne().sort({ order: -1 });
    const order = lastItem ? lastItem.order + 1 : 0;

    const newItem = await Service.create({ ...body, order });
    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (id) {
      const updated = await Service.findByIdAndUpdate(id, body, { returnDocument: "after" });
      if (!updated)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(updated);
    }

    // Bulk update for reordering
    if (Array.isArray(body)) {
      const updates = body.map((item, idx) =>
        Service.findByIdAndUpdate(item._id, { order: idx }),
      );
      await Promise.all(updates);
      return NextResponse.json({ message: "Order updated" });
    }

    return NextResponse.json(
      { error: "ID or array required" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Keep PUT for compatibility or bulk save (but make it smarter than delete-all)
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await req.json();

    // Instead of deleteMany, we can just return an error or handle it as bulk save
    // For now, let's just make it a bulk reorder proxy to PATCH if it's an array
    if (Array.isArray(items)) {
      const updates = items.map((item, idx) =>
        Service.findByIdAndUpdate(
          item._id,
          { ...item, order: idx },
          { upsert: true },
        ),
      );
      await Promise.all(updates);
      return NextResponse.json({ message: "Bulk saved" });
    }

    return NextResponse.json({ error: "Array required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
