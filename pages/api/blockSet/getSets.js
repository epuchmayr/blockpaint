import clientPromise from '../../../lib/mongodb';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('block_paint');

    const blockSet = await db
      .collection('blockSet')
      .find({})
      .project({ set_name: 1, thumbnail: 1 })
      .toArray();

    return res.status(200).json(blockSet);
  } catch (e) {
    console.error('getSets error:', e);
    return res.status(500).json({ error: 'Failed to load sets' });
  }
};
