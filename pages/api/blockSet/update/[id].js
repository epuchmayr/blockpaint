import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  
  const { id } = req.query

   try {
       const client = await clientPromise;
       const db = client.db("block_paint");

       const result = await db
           .collection("blockSet")
           .updateOne(
            {_id: ObjectId(id)},
            { $set: {blockData: req.body}},
            { upsert: true }
            )
        // .insertOne({blockData: req.body})
       
       console.log(`New set created with the following id: ${result.insertedId}`)
        // console.log('passed data', req.body)
       
       res.json(result);
   } catch (e) {
       console.error(e);
   }
};