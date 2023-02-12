import { NextApiRequest, NextApiResponse } from "next";

const delay = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

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

        if (readData.ok) {
          const data = await readData.json();
          res.status(200).json(data.documents);
        } else {
          res.status(readData.status).json({ error: readData.statusText });
        }
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

        if (insertData.ok) {
          const insertDataJson = await insertData.json();
          res.status(200).json(insertDataJson);
        } else {
          res.status(insertData.status).json({ error: insertData.statusText });
        }

        break;
      case "PUT":
        const updateData = await fetch(`${baseUrl}/updateOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { uid: req.body.uid },
            update: {
              $set: {
                body: req.body.body,
              },
            },
          }),
        });

        if (updateData.ok) {
          const updateDataJSON = await updateData.json();
          res.status(200).json(updateDataJSON);
        } else {
          res.status(updateData.status).json({ error: updateData.statusText });
        }

        break;
      case "DELETE":
        const deleteData = await fetch(`${baseUrl}/deleteOne`, {
          ...fetchOptions,
          body: JSON.stringify({
            ...fetchBody,
            filter: { uid: req.body.uid },
          }),
        });

        if (deleteData.ok) {
          const deleteDataJSON = await deleteData.json();
          res.status(200).json(deleteDataJSON);
        } else {
          res.status(deleteData.status).json({ error: deleteData.statusText });
        }
      default:
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}

// TODO
// - prevent empty data
// - prevent injection
