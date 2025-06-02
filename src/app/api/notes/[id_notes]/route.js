import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id_notes } = params;

  try {
    const note = await prisma.notes.findUnique({
      where: {
        id_notes: id_notes,
      },
    });

    if (!note) {
      return Response.json({ code: 404, message: 'Notes not found' }, { status: 404 });
    }

    return Response.json({ code: 200, message: 'Berhasil mendapatkan Notes', data: note }, { status: 200 });
  } catch (error) {
    return Response.json({ code: 500, message: 'Gagal mendapatkan Notes' }, { status: 500 });
  }
}
