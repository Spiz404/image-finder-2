import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { Router, Request, Response } from "express";
import { storage, db } from "../firebase-config";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import multer from "multer";
import express from "express";
import axios from "axios";
import FormData from "form-data";
require("dotenv").config();

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const storageRef = ref(storage, "images");

export const imageRouter = Router();

// multer buffer for images
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

type imageItem = {
  url: string;
  location: string;
};

type queryType = {
  query: string;
  numresults: number;
};

imageRouter.get("/", async (req: Request, res: Response) => {
  const data = await listAll(storageRef);
  const items = data.items;

  const images: Array<imageItem> = await Promise.all(
    items.map(async (item) => {
      const path = item.fullPath;
      let itemRef = ref(storage, path);
      const url = await getDownloadURL(itemRef);
      return { url: url, location: path };
    }),
  );

  res.send(images);
});

imageRouter.delete("/", express.json(), async (req: Request, res: Response) => {
  const { image } = req.body;
  console.log(image);
  const imageId: string = image.split("/").pop();

  const imageRef = ref(storage, image);

  deleteObject(imageRef)
    .then((result) => {
      axios.post(`${process.env.AGENT_URL}/delete`, {
        id: image,
      });

      return res.status(200).send("delete successful");
    })
    .then(async (res) => {
      await deleteDoc(doc(db, "images", imageId));
    })
    .catch((err) => {
      return res.status(400).send("delete failed");
    });
});

imageRouter.post(
  "/upload",
  upload.single("image"),
  async (req: MulterRequest, res: Response) => {
    if (req.file) {
      // add image to images
      const docRef = await addDoc(collection(db, "images"), {});

      // get document id and use it to upload image in the cloud storage
      const id = docRef.id;

      const bytes = req.file.buffer;

      const imageStorageRef = ref(storage, `images/${id}`);

      uploadBytes(imageStorageRef, bytes)
        .then((snapshot) => {
          // send image to agent
          const form = new FormData();
          form.append("id", id);
          form.append("image", bytes, req.file.originalname);
          axios.post(`${process.env.AGENT_URL}/upload?id=${id}`, form, {
            headers: {
              ...form.getHeaders(),
            },
          });

          return res.status(200).send("Upload done");
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send("Upload failed");
        });

      return;
    }

    // if request doesn't have a file parameter, it means that it doesn't contain an image
    return res.status(400).send("wrong request structure");
  },
);

imageRouter.post(
  "/query",
  express.json(),
  async (req: Request, res: Response) => {
    console.log("query request");
    const body: queryType = req.body;
    console.log(body);
    axios
      .post(`${process.env.AGENT_URL}/query`, {
        query: body.query,
        numresults: body.numresults,
      })
      .then(async (agent_response) => {
        const data: Array<string> = agent_response.data;

        const urls: Array<imageItem> = await Promise.all(
          // awaiting for all the images download urls
          data.map(async (image_id) => {
            const imagePath = `images/${image_id}`;
            const imageReference = ref(storage, imagePath);
            const url = await getDownloadURL(imageReference);
            return { url: url, location: imagePath };
          }),
        );

        return res.status(200).json(urls);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("error");
      });
  },
);

export default imageRouter;
