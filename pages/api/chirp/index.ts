import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": process.env.DB_API_KEY as string,
  };

  const fetchOptions = {
    method: "POST",
    headers: headers,
  };

  const fetchBody = {
    dataSource: process.env.DB_DATA_SOURCE,
    database: "chirp",
    collection: "chirps",
  };
  const baseUrl = `${process.env.DB_DATA_URL}/action`;

  try {
    switch (req.method) {
      case "GET":
        const readData = await fetch(`${baseUrl}/find`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            sort: { postedAt: -1 },
          }),
        });
        const data = await readData.json();
        res.status(200).json(data.documents);
        break;
      case "POST":
        const newPost = req.body;
        const insertData = await fetch(`${baseUrl}/insertOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            document: newPost,
          }),
        });
        const insertDataJson = await insertData.json();
        res.status(200).json(insertDataJson);
        break;

      default:
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}