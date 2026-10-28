import clientPromise from '../../../lib/mongodb';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('block_paint');

    const result = await db.collection('blockSet').insertOne(req.body);

    console.log(`New set created with the following id: ${result.insertedId}`);
    // console.log('passed data', req.body)

    return res.status(200).json(result);
  } catch (e) {
    console.error('createSet error:', e);
    return res.status(500).json({ error: 'Failed to create set' });
  }
};
