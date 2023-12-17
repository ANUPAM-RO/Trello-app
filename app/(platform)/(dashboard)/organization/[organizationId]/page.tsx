import { create } from "@/actions/createBoard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

const OrganizationIdPage = () => {
  return (
    <div>
      <form action={create}>
        <input id="title" name="title" className="border-black border p-1" required placeholder="Enter a board title" />
        <Button type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}

export default OrganizationIdPage
