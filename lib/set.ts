import { server } from '../config';

export async function getAllSetIds() {
  
  const response = await fetch(`${server}/api/blockSet/getSets`);
  const jsonData = await response.json();
  const parsedData = JSON.parse(JSON.stringify(jsonData))
  
  return parsedData.map((item: {_id: string}) => {
    return {
      params: {
        id: item._id
      }
    }
  })
}

// LOAD set data from database
export async function getSetData(setId: string) {

  try {
    const response = await fetch(`${server}/api/blockSet/${setId}`);
    const jsonData = await response.json();
    const parsedData = JSON.parse(JSON.stringify(jsonData))
    // console.log('getSetData', parsedData)
    return parsedData;
  } catch (error) {
    console.error(error);
  }
}


export async function getSetsData() {

    const response = await fetch(`${server}/api/blockSet/getSets`);
    const jsonData = await response.json();
    const parsedData = JSON.parse(JSON.stringify(jsonData))
    // console.log('getAllSetsData', parsedData)

  return parsedData;
}
