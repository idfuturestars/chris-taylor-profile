import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get platform statistics
router.get("/platform-stats", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Mock platform statistics for now
    const stats = {
      totalUsers: 15842,
      activeStudents: 12341,
      staffMembers: 287,
      institutions: 43,
      dailyActiveUsers: 1523,
      monthlyGrowth: 12.5
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ error: "Failed to fetch platform statistics" });
  }
});

// Get all users
router.get("/users", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user
router.patch("/users/:userId", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const updatedUser = await storage.updateUser(req.params.userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Create user
router.post("/users", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const newUser = await storage.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get all institutions
router.get("/institutions", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const institutions = await storage.getInstitutions();
    res.json(institutions);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

// Create institution
router.post("/institutions", async (req: any, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const institution = await storage.createInstitution(req.body);
    res.status(201).json(institution);
  } catch (error) {
    console.error("Error creating institution:", error);
    res.status(500).json({ error: "Failed to create institution" });
  }
});

export default router;