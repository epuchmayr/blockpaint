import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";


export default async (req, res) => {
  
  const { id } = req.query

  try {
      const client = await clientPromise;
      const db = client.db("block_paint");

      const blockSet = await db
          .collection("blockSet")
          .findOne({_id: ObjectId(id)})
       //    .sort({ metacritic: -1 })
       //    .limit(1)
       //    .toArray();

      res.json(blockSet);
  } catch (e) {
      console.error(e);
  }
};