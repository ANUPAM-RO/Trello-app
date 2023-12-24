"use client"

import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { useState } from "react";

interface BoardTitleFormProps{
    data: Board;
}
export const BoardTitleForm = ({
    data,
}: BoardTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const disabledEditing = () => {
        setIsEditing(false);
    }
    return (
        <Button variant="transparent" className="font-bold text-lg h-auto w-auto p-1 px-2">
            {data.title}
        </Button>
    );
};