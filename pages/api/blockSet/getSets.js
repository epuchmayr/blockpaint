import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {

  try {
      const client = await clientPromise;
      const db = client.db("block_paint");

      const blockSet = await db
          .collection("blockSet")
          .find({})
          .toArray();

      res.json(blockSet);
  } catch (e) {
      console.error(e);
  }
};