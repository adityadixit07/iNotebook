const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchUser");
const Notes = require("../Models/Notes");
const { body, validationResult } = require("express-validator");

// route1: get all the notes using get "api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// route 2: adding the new note login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// route 3 updating the existing notes login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  // create a new note
  try {
  const newNote={};
  if (title) {newNote.title = title;}
  if (description) {newNote.description = description;}
  if (tag) {newNote.tag = tag;}
//   find the note be updateed and update it
   let note=await Notes.findById(req.params.id)
   if(!note){
      return res.status(404).send("Not found.")
   }
   if(note.user.toString()!==req.user.id){
      return res.status(401).send('Not allowed')
   }
   // if note exist then
   note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
   res.json(note);   
  } catch (error) {
   console.log(error.message);
   res.json(500).send("internal server occured!")
}
});

// endpoint for deleting a note 
// route 3  deleting a note  login required
router.delete('./deletenote/:id',fetchUser,async (req,res)=>{
//   find the note be updated and deleted it
try{
   let note=await Notes.findById(req.params.id)
   if(!note){
      return res.status(404).send("Not found.")
   }
   // allow deletion if this note belong to the user
   if(note.user.toString()!==req.user.id){
      return res.status(401).send('Not allowed')
   }
   // if note exist then
   note=await Notes.findByIdAndDelete(req.params.id)
   res.json({"Success":"note has been deleted succesfully",note:note});
}
   catch(error){
      console.log(error.message);
      res.status(500).send("internal error occured.")   
   }
})

module.exports = router;
