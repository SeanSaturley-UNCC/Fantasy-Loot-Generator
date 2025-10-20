const Item = require('../models/itemModel');
async function generateLoot(req,res,next){
  try{
    const [doc]=await Item.aggregate([{ $match:{active:true}},{ $sample:{size:1}},{ $project:{ _id:0,title:1,rarity:1,price:1,details:1,image:1}}]);
    if(!doc) return res.status(404).json({message:'No items found'});
    const imageUrl = `/images/${encodeURIComponent(doc.image)}`;
    res.json({...doc, imageUrl});
  }catch(err){ next(err); }
}
async function list(req,res,next){
  try{ const items=await Item.find({active:true}).sort({title:1}).lean(); res.json(items); }
  catch(err){ next(err); }
}
module.exports = { generateLoot, list };
