import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('block_paint');

    const result = await db
      .collection('blockSet')
      .deleteOne({ _id: ObjectId(id) });

    console.log(`${result.deletedCount} were deleted`);

    return res.status(200).json(result);
  } catch (e) {
    console.error('delete set error:', e);
    return res.status(500).json({ error: 'Failed to delete set' });
  }
};
