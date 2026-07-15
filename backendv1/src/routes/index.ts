import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.json({ message: "API Running" });
});

export default router;