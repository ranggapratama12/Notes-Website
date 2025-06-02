"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function EditNotePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
      return;
    }
    setToken(storedToken);

    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (!res.ok) throw new Error("Catatan tidak ditemukan");

        const { data } = await res.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        toast({
          title: "Gagal mengambil catatan",
          description: "Pastikan catatan tersedia.",
        });
      }
    };

    fetchNote();
  }, [id, toast, router]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan",
        description: "Judul dan isi tidak boleh kosong.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_notes: id,
          id_user: note.id_user,
          title,
          content,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui catatan");

      toast({
        className: cn("bg-green-500", "text-white"),
        title: "Catatan diperbarui",
        description: "Perubahan telah disimpan.",
      });

      router.push("/notes");
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat memperbarui catatan.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!note)
    return (
      <div className="mt-20 flex flex-col justify-center items-center gap-4 text-center text-2xl text-gray-500">
        <Loader size={24} className="animate-spin text-blue-700" />
        <p>Memuat catatan...</p>
      </div>
    );

  return (
    <Card className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl text-center text-[#710193] font-bold">Edit Catatan</h1>

      <div className="mt-10">
        <Label htmlFor="title" className="ml-2 block text-lg font-medium mb-1">
          Judul
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="content" className="ml-2 block text-lg font-medium mb-1">
          Isi
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => router.back()}>
          Batal
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </Card>
  );
}
