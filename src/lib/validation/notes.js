import { z } from "zod";

export const createNoteSchema = z.object({
  id_user: z.string({
    required_error: "Id User is required",
    invalid_type_error: "Id User must be a string"
  }).min(1, "Id User cannot be empty"),
  
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string"
  }).min(1, "Title cannot be empty"),
  
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string"
  }).min(1, "Content cannot be empty"),
});


export const updateNoteSchema = z.object({
  id_notes: z.string({
    required_error: "Id Notes is required",
    invalid_type_error: "Id Notes must be a string",
  }).min(1, "Id Notes cannot be empty"),
  
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string"
  }).min(1, "Title cannot be empty"),
  
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string"
  }).min(1, "Content cannot be empty"),
});


export const deleteNoteSchema = z.object({
  id_notes: z.string({
    required_error: "Id Notes is required",
    invalid_type_error: "Id Notes must be a string",
  }).min(1, "Id Notes cannot be empty")
});

