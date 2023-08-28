

export async function getAllSetIds() {
  
  const response = await fetch(`${process.env.HOST}/api/blockSet/getSets`);
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

    const response = await fetch(`${process.env.HOST}/api/blockSet/${setId}`);
    const jsonData = await response.json();
    const parsedData = JSON.parse(JSON.stringify(jsonData))
    // console.log('getSetData', parsedData)

  return parsedData;
}


export async function getSetsData() {

    const response = await fetch(`${process.env.HOST}/api/blockSet/getSets`);
    const jsonData = await response.json();
    const parsedData = JSON.parse(JSON.stringify(jsonData))
    // console.log('getAllSetsData', parsedData)

  return parsedData;
}
