const express = require("express");
const db = require("../data/helpers/childDb");
const router = express.Router();
// const { authenticate } = require("../middleware/authMidware");

router.get("/", (req, res) => {
  db.get()
    .then(children => {
      res.status(200).json(children);
    })
    .catch(err => res.status(500).json(err.message));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get(id)
    .then(child => {
      if (child) {
        res.status(200).json(child);
      } else {
        res.status(404).json({
          message: "The child with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

router.post("/", async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide a name for the child." });
  }

  try {
    let newchild = await db.insert(req.body);
    let updatedArray = await db.get();
    return res.status(201).json({
      id: newchild.id,
      name: req.body.name,
      children: updatedArray
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let child = await db.get(id);
    if (!child) {
      res
        .status(404)
        .json({ message: "The child with the specified ID does not exist." });
    }
    await db.remove(id);
    let updatedArray = await db.get();
    return res.status(200).json({
      child: updatedArray,
      message: "successfully deleted"
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//updates the child and returns the updated array of children
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body.name;

  if (!name) {
    return res.status(400).json({ message: "Please provide a name." });
  } else {
    db.get(id).then(child => {
      if (!child) {
        return res.status(404).json({
          message: "The child with the specified ID does not exist."
        });
      }
    });
  }
  try {
    let update = await db.update(id, child);
    let updatedchild = await db.get(id);
    let updatedArray = await db.get();
    return res
      .status(200)
      .json({ child: updatedchild, children: updatedArray });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
