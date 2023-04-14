import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  
    const { id } = req.query

    try {
        const client = await clientPromise;
        const db = client.db("block_paint");

        const result = await db
           .collection("blockSet")
           .deleteOne({_id: ObjectId(id)})

        console.log(`${result.deletedCount} were deleted`)
       
       res.json(result);
   } catch (e) {
       console.error(e);
   }
};