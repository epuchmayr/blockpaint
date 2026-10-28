import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('block_paint');

    const result = await db.collection('blockSet').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          grid_data: req.body.grid_data,
          thumbnail: req.body.thumbnail,
          set_name: req.body.set_name,
          last_update: req.body.last_update,
        },
      },
    );

    console.log(
      `Set updated with the following id: ${id} - ${result.upsertedId}`,
    );
    // console.log('passed data', req.body)

    return res.status(200).json(result);
  } catch (e) {
    console.error('update set error:', e);
    return res.status(500).json({ error: 'Failed to update set' });
  }
};
