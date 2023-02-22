import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { IPost } from "@/components/chirp/post";

type TResponse = {
  data: IPost[];
};

type TError = {
  error: string;
};

// Adds a delay to the request to the optimistic updates (use: await delay())
const delay = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));

// API Route handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse<TResponse | TError>) {
  // get session information from NextAuth
  const session = await getServerSession(req, res, authOptions);

  // set headers for requests to MongoDB database
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": process.env.DB_API_KEY as string,
  };

  // set options for fetch requests
  const fetchOptions = {
    method: "POST",
    headers: headers,
  };

  // set body for fetch requests
  const fetchBody = {
    dataSource: process.env.DB_DATA_SOURCE,
    database: "chirp",
    collection: "chirps",
  };

  // set base URL for fetch requests
  const baseUrl = `${process.env.DB_DATA_URL}/action`;

  try {
    switch (req.method) {
      case "GET":
        // Fetch the data and sort descending
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
          // Log error to server console
          console.warn(await readData.json());

          // Send back error request
          res.status(readData.status).json({ error: readData.statusText });
        }
        break;
      case "POST":
        const newPost = req.body;
        // insert a new post into the database
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
          // Log error to server console
          console.log(await insertData.json());

          // Send back response with status error if unsuccessful
          res.status(insertData.status).json({ error: insertData.statusText });
        }

        break;
      case "PUT":
        // update an existing post in the database
        if (!session) {
          // return an error response if the user is not authenticated
          res.status(401).json({ error: "Login to modify this item!" });
          break;
        }

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
        if (!session) {
          res.status(401).json({ error: "Login to delete this item!" });
          break;
        }

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
          // Log error to server console
          console.log(await deleteData.json());

          // Send back response with status error
          res.status(deleteData.status).json({ error: deleteData.statusText });
        }
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

// TODO
// - prevent empty data
// - prevent injection
