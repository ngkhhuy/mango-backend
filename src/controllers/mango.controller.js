const Mango = require('../models/mango.model');
const cloudinary = require('../config/cloudinary');

exports.createMango = async (req, res) => {
  try {
    
    const { classify, weight, volume } = req.body;

   
    if (!classify || !weight || !volume) {
      return res.status(400).json({ message: 'Missing required fields: classify, weight, volume' });
    }

    
    if (!req.file) {
      return res.status(400).json({ message: 'Missing image file' });
    }

    
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
        }
        
        const newMango = new Mango({
          classify,
          weight,
          volume,
          imageUrl: result.secure_url,
        });

        try {
          const savedMango = await newMango.save();
          res.status(201).json(savedMango);
        } catch (err) {
          console.error('Error saving Mango to DB:', err);
          res.status(500).json({ message: 'Error saving data to database', error: err.message });
        }
      }
    );

    
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error in createMango:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMangoes = async (req, res) => {
  try {
    const mangoes = await Mango.find();
    res.json(mangoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
