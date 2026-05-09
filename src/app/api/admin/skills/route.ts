import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import Tech from "@/models/Tech";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await Skill.findById(id).lean();
      if (!item)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    }

    const [skills, techDoc] = await Promise.all([
      Skill.find().sort({ order: 1 }).lean(),
      Tech.findOne().lean(),
    ]);

    return NextResponse.json({
      skills: skills || [],
      techList: techDoc?.techList || [],
    });
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

    const lastItem = await Skill.findOne().sort({ order: -1 });
    const order = lastItem ? lastItem.order + 1 : 0;

    const newItem = await Skill.create({ ...body, order });
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
    const type = searchParams.get("type");
    const body = await req.json();

    if (id) {
      const updated = await Skill.findByIdAndUpdate(id, body, { new: true });
      if (!updated)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(updated);
    }

    if (type === "banner") {
      const updated = await Tech.findOneAndUpdate(
        {},
        { techList: body.techList || [] },
        { upsert: true, new: true },
      );
      return NextResponse.json(updated);
    }

    if (Array.isArray(body)) {
      const updates = body.map((item, idx) =>
        Skill.findByIdAndUpdate(item._id, { order: idx }),
      );
      await Promise.all(updates);
      return NextResponse.json({ message: "Order updated" });
    }

    return NextResponse.json(
      { error: "Missing ID, type, or array" },
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

    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Keep PUT for compatibility (refactored to avoid deleteMany)
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { skills, techList } = await req.json();

    if (skills) {
      const updates = skills.map((s: any, i: number) =>
        Skill.findByIdAndUpdate(s._id, { ...s, order: i }, { upsert: true }),
      );
      await Promise.all(updates);
    }

    if (techList) {
      await Tech.findOneAndUpdate(
        {},
        { techList: techList || [] },
        { upsert: true },
      );
    }

    return NextResponse.json({ message: "Skills & Tech saved" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
