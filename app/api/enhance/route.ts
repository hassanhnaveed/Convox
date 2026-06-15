import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.PICWISH_API_KEY!;

    // Step 1: Task create karo
    const uploadForm = new FormData();
    uploadForm.append("image_file", file);
    uploadForm.append("sync", "1"); // sync mode - direct result
    uploadForm.append("type", "clean"); // non-portrait best
    uploadForm.append("scale_factor", "2"); // 2x upscale
    uploadForm.append("return_type", "1"); // URL return

    const createRes = await fetch(
      "https://techhk.aoscdn.com/api/tasks/visual/scale",
      {
        method: "POST",
        headers: { "X-API-KEY": apiKey },
        body: uploadForm,
      },
    );

    const createData = await createRes.json();
    console.log("Picwish create response:", createData);

    if (!createData.data) {
      throw new Error(createData.message || "Task creation failed");
    }

    // Sync mode mein direct image milti hai
    if (createData.data.image) {
      return NextResponse.json({
        success: true,
        enhancedUrl: createData.data.image,
      });
    }

    // Async mode mein task_id milta hai - polling karo
    const taskId = createData.data.task_id;
    if (!taskId) throw new Error("No task_id received");

    // Polling - max 30 seconds
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));

      const resultRes = await fetch(
        `https://techhk.aoscdn.com/api/tasks/visual/scale/${taskId}`,
        { headers: { "X-API-KEY": apiKey } },
      );

      const resultData = await resultRes.json();
      console.log(`Poll ${i + 1}:`, resultData);

      if (resultData.data?.progress >= 100 && resultData.data?.image) {
        return NextResponse.json({
          success: true,
          enhancedUrl: resultData.data.image,
        });
      }

      if (resultData.data?.state < 0) {
        throw new Error("Enhancement failed on server");
      }
    }

    throw new Error("Timeout - please try again");
  } catch (err: any) {
    console.error("Enhancement error:", err);
    return NextResponse.json(
      { error: err.message || "Enhancement failed" },
      { status: 500 },
    );
  }
}
