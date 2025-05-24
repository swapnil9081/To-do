const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");

// CREATE
router.post("/addTask", async (req, res) => {
    try {
        const { title, body, email } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const list = new List({ title, body, user: existingUser._id });
            await list.save();

            existingUser.list.push(list._id);
            await existingUser.save();

            return res.status(200).json({ list });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Add Task Error:", error);
        res.status(500).json({ message: "Server error while adding task" });
    }
});

// UPDATE
router.put("/updateTask/:id", async (req, res) => {
    try {
        const { title, body } = req.body;
        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            { title, body },
            { new: true }
        );

        if (updatedList) {
            return res.status(200).json({ message: "Task Updated", updatedList });
        } else {
            return res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ message: "Server error while updating task" });
    }
});

//DELETE TASK
router.delete("/deleteTask/:id", async (req, res) => {
    try {
        const {email} = req.body;
        const existingUser = await User.findOneAndUpdate({email},{$pull:{list:req.params.id}}
        );

        if (existingUser) {
            const list = await List.findByIdAndDelete(req.params.id).then(() => res.status(200).json({message: "Task Deleted"}))
        } 
    } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ message: "Server error while updating task" });
    }
});

//GET TASK
router.get("/getTask/:id", async(req, res) => {
        const list = await List.find({user: req.params.id}).sort({createdAt: -1});
        if(list.length !== 0){
            res.status(200).json({list: list});
        }
        else{
            res.status(200).json({"message":"No Task"})
        }
    });


module.exports = router;
