import express from "express";
import { healthCheck } from "../controllers/health-check.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: Health Check
 */

/**
 * @swagger
 * /api/health-check:
 *   get:
 *     summary: Health Check
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/", healthCheck);

export default router;
