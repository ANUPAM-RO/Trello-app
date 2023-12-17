"use server"
import { db } from "@/lib/db";
import { z } from "zod";

const CreateBoard = z.object({
     title: z.string()
 })

  export async function create(formData: FormData) {
    "use server"

    const title = formData.get("title") as string;

    await db.board.create({
      data: {
        title
      }
    })
  }