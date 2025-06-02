import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  status: z.string().min(1, "Status tidak boleh kosong"),
  profileLink: z.string().url("Profile link harus berupa URL"),
  websiteLink: z.string().url("Website link harus berupa URL"),
  imageUrl: z.string().url("Image URL harus berupa URL"),
});

export const updateProjectSchema = createProjectSchema.extend({
  id_project: z.string().min(1, "ID Project diperlukan"),
});

export const deleteProjectSchema = z.object({
  id_project: z.string().min(1, "ID Project diperlukan"),
});
