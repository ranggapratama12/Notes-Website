import prisma from "@/lib/prisma";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/notes";
import { verifyToken } from "@/lib/(back-end)/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const notes = await prisma.notes.findMany({
      include: { user: true },
    });

    const formattedNotes = notes.map((note) => {
      const { user, ...rest } = note;
      return {
        nm_lengkap: user.nm_lengkap,
        ...rest,
      };
    });

    return Response.json(
      {
        code: 200,
        message: "Anda Berhasil Mengakses API Notes",
        data: { notes: formattedNotes },
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { code: 500, message: "Anda Gagal Mengakses API Notes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const user = verifyToken(authHeader);

    const body = await request.json();
    const validate = createNoteSchema.safeParse(body);

    if (!validate.success) {
      const messages = validate.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      return Response.json({ code: 400, errors: messages }, { status: 400 });
    }

    const note = await prisma.notes.create({
      data: {
        id_user: user.userId,
        title: validate.data.title,
        content: validate.data.content,
      },
    });

    return Response.json(
      { code: 200, message: "Anda Berhasil Membuat Notes", data: note },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return Response.json({ code: status, message: error.message }, { status });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const user = verifyToken(authHeader);

    const body = await request.json();
    const validate = updateNoteSchema.safeParse(body);

    if (!validate.success) {
      const messages = validate.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      return Response.json({ code: 400, errors: messages }, { status: 400 });
    }

    const existingNote = await prisma.notes.findUnique({
      where: { id_notes: validate.data.id_notes },
    });

    if (!existingNote) {
      return Response.json(
        { code: 404, message: "Notes not found" },
        { status: 404 }
      );
    }

    if (existingNote.id_user !== user.userId) {
      return Response.json(
        { code: 403, message: "Forbidden: Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    const updatedNote = await prisma.notes.update({
      where: { id_notes: validate.data.id_notes },
      data: {
        title: validate.data.title,
        content: validate.data.content,
        updated_at: new Date(),
      },
    });

    return Response.json(
      { code: 200, message: "Berhasil Update Notes", data: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return Response.json({ code: status, message: error.message }, { status });
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const user = verifyToken(authHeader);

    const body = await request.json();
    const validate = deleteNoteSchema.safeParse(body);

    if (!validate.success) {
      const messages = validate.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      }));
      return Response.json({ code: 400, errors: messages }, { status: 400 });
    }

    const existingNote = await prisma.notes.findUnique({
      where: { id_notes: validate.data.id_notes },
    });

    if (!existingNote) {
      return Response.json(
        { code: 404, message: "Notes not found" },
        { status: 404 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id_user: user.userId },
    });

    if (existingNote.id_user !== existingUser.id_user) {
      return Response.json(
        { code: 403, message: "Forbidden: Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    await prisma.notes.delete({
      where: { id_notes: validate.data.id_notes },
    });

    return Response.json(
      { code: 200, message: "Berhasil Menghapus Notes" },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return Response.json({ code: status, message: error.message }, { status });
  }
}
