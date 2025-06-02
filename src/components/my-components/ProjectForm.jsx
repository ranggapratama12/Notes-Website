"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import jwt from "jsonwebtoken";

const ProjectForm = () => {
  const [form, setForm] = useState({
    name: "",
    nim: "",
    status: "",
    profileLink: "",
    websiteLink: "",
    imageUrl: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      try {
        const decoded = jwt.decode(token);
        setUserId(decoded?.userId);
      } catch (error) {
        console.error("Gagal decode token:", error);
        router.push("/");
      }
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!form.name || !form.nim || !form.status || !form.profileLink || !form.websiteLink || !form.imageUrl) {
      toast({
        variant: "destructive",
        title: "Gagal mengirim",
        description: "Semua kolom wajib diisi.",
      });
      return;
    }

    setLoading(true);

    // ${process.env.NEXT_PUBLIC_API_URL}/v2/tugas-akhir
    try {
      const res = await fetch(`http://localhost:3000/api/v2/tugas-akhir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal mengirim data project");

      toast({
        className: cn("bg-green-500", "text-white"),
        title: "Berhasil",
        description: "Data project berhasil dikirim.",
      });

      setForm({
        name: "",
        nim: "",
        status: "",
        profileLink: "",
        websiteLink: "",
        imageUrl: "",
      });

      router.push("/tugas-akhir");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal mengirim",
        description: "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 md:px-20 py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center uppercase text-[#1d2533]">
          Kirim Data Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              Nama
            </Label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              NIM
            </Label>
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              Status
            </Label>
            <Select onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger>
                <SelectValue
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pilih Status"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* <SelectLabel>Pilih Status</SelectLabel> */}
                  <SelectItem value="peserta">Peserta</SelectItem>
                  <SelectItem value="panitia">Panitia</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              Link Profile
            </Label>
            <Input
              type="url"
              name="profileLink"
              value={form.profileLink}
              onChange={handleChange}
              required
              placeholder="https://github.com/username"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              Link Website
            </Label>
            <Input
              type="url"
              name="websiteLink"
              value={form.websiteLink}
              onChange={handleChange}
              required
              placeholder="https://nama-project.vercel.app"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-semibold mb-1 text-gray-700">
              URL Gambar Preview
            </Label>
            <Input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://domain.com/image-preview.png"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Send className="w-5 h-5" />
            Kirim Data Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
