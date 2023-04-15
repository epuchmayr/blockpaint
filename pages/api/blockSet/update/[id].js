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
                { $set: {
                    grid_data: req.body.grid_data,
                    thumbnail: req.body.thumbnail,
                    set_name: req.body.set_name
                }}
                )
       
        console.log(`Set updated with the following id: ${result.upsertedId}`)
        // console.log('passed data', req.body)

        res.json(result);
    } catch (e) {
        console.error(e);
    }
};