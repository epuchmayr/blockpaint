import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('block_paint');

    const setData = await db
      .collection('blockSet')
      .findOne({ _id: ObjectId(id) });
    //    .sort({ metacritic: -1 })
    //    .limit(1)
    //    .toArray();

    return res.status(200).json(setData);
  } catch (e) {
    console.error('get by id error:', e);
    return res.status(500).json({ error: 'Failed to load set' });
  }
};
