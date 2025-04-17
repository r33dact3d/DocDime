// api/upload.js

export default function handler(req, res) {
  if (req.method === "POST") {
    // You can add file handling logic here if needed.
    res.status(200).json({ message: "Upload received" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}